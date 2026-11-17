const express = require('express');
const bcrypt = require('bcryptjs');
const { rateLimit } = require('express-rate-limit');
const { createHash } = require('node:crypto');
const pool = require('../db/pool');
const { criarTokenRedefinicao } = require('../utils/tokenresetasenha');
const { enviarEmailRedefinicao } = require('../services/emailredefinicao');
const router = express.Router();

const limitarTentativasLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limite de 5 tentativas
    standardHeaders: true, // Retorna informações de limite de taxa nos cabeçalhos `RateLimit-*`
    legacyHeaders: false, // Desativa os cabeçalhos `X-RateLimit-*`
    message: 'Muitas tentativas de login. Por favor, tente novamente mais tarde.'
});

const limitarSolicitacaoRedefinicao = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        mensagem: 'Muitas solicitações. Tente novamente mais tarde.',
    },
});

const limitarRedefinicaoSenha = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        mensagem: 'Muitas tentativas. Tente novamente mais tarde.',
    },
});

router.post(
    '/solicitar-redefinicao',
    limitarSolicitacaoRedefinicao,
    async (req, res, next) => {
        const respostaGenerica = {
            mensagem: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.',
        };

        try {
            const email = typeof req.body?.email === 'string'
                ? req.body.email.trim().toLowerCase()
                : '';

            if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ mensagem: 'E-mail inválido.' });
            }

            const consulta = await pool.query(
                `SELECT id_candidato, email
                 FROM candidato
                 WHERE LOWER(email) = $1`,
                [email]
            );

            const candidato = consulta.rows[0];

            if (candidato) {
                const { token, tokenHash } = criarTokenRedefinicao();

                await pool.query(
                    `DELETE FROM token_redefinicao_senha
                     WHERE id_candidato = $1`,
                    [candidato.id_candidato]
                );

                await pool.query(
                    `INSERT INTO token_redefinicao_senha
                        (id_candidato, token_hash, expira_em)
                     VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '30 minutes')`,
                    [candidato.id_candidato, tokenHash]
                );

                try {
                    await enviarEmailRedefinicao(candidato.email, token);
                } catch (error) {
                    console.error('Falha ao enviar e-mail de redefinição:', error.code || error.name);
                }
            }

            return res.status(202).json(respostaGenerica);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/redefinir-senha',
    limitarRedefinicaoSenha,
    async (req, res, next) => {
        const { token, senha } = req.body ?? {};

        if (
            typeof token !== 'string' ||
            !/^[a-f0-9]{64}$/i.test(token) ||
            typeof senha !== 'string' ||
            senha.length < 6 ||
            Buffer.byteLength(senha, 'utf8') > 72
        ) {
            return res.status(400).json({
                mensagem: 'Token ou senha inválidos.',
            });
        }

        const tokenHash = createHash('sha256')
            .update(token, 'utf8')
            .digest('hex');

        let client;

        try {
            client = await pool.connect();
            await client.query('BEGIN');

            const consulta = await client.query(
                `SELECT id_token, id_candidato
                 FROM token_redefinicao_senha
                 WHERE token_hash = $1
                   AND expira_em > CURRENT_TIMESTAMP
                   AND usado_em IS NULL
                 FOR UPDATE`,
                [tokenHash]
            );

            const registroToken = consulta.rows[0];

            if (!registroToken) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    mensagem: 'Token inválido ou expirado.',
                });
            }

            const senhaHash = await bcrypt.hash(senha, 10);

            await client.query(
                `UPDATE candidato
                 SET senha_hash = $1
                 WHERE id_candidato = $2`,
                [senhaHash, registroToken.id_candidato]
            );

            await client.query(
                `UPDATE token_redefinicao_senha
                 SET usado_em = CURRENT_TIMESTAMP
                 WHERE id_token = $1`,
                [registroToken.id_token]
            );

            await client.query('COMMIT');

            return res.json({
                mensagem: 'Senha redefinida com sucesso.',
            });
        } catch (error) {
            if (client) {
                await client.query('ROLLBACK');
            }
            return next(error);
        } finally {
            client?.release();
        }
    }
);

router.post('/login', limitarTentativasLogin, async (req, res, next) => {
    try {
        const cpf = typeof req.body?.cpf === 'string'
          ? req.body.cpf.replace(/[^0-9]/g, '')
          : '';
        const senha = req.body?.senha;
        

        if (!/^\d{11}$/.test(cpf) || typeof senha !== 'string' || senha.length === 0) {
            return res.status(400).json({ mensagem: 'CPF ou senha inválidos' });
        }

        const consulta = await pool.query(
            `SELECT id_candidato, nome_completo, senha_hash
            FROM candidato
            WHERE cpf = $1`,
            [cpf]
        );

        const candidato = consulta.rows[0];

        if (!candidato || !(await bcrypt.compare(senha, candidato.senha_hash))) {
            return res.status(401).json({ mensagem: 'CPF ou senha inválidos' });
        }

        await new Promise((resolve, reject) => {
            req.session.regenerate((error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        req.session.candidato = {
            id: candidato.id_candidato,
            nome: candidato.nome_completo
        };

        await new Promise((resolve, reject) => {
            req.session.save((error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        return res.json({
            usuario: {
                id: candidato.id_candidato,
                nome: candidato.nome_completo
            },
        });
    } catch (error) {
        next(error);
    }
});

router.get('/me', (req, res) => {
    if (!req.session?.candidato) {
        return res.status(401).json({ mensagem: 'Não autorizado' });
    }

    return res.json({ usuario: req.session.candidato });
});

router.post('/logout', (req, res, next) => {
    req.session.destroy((error) => {
        if (error) return next(error);

        res.clearCookie('portal.sid', {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });

        return res.status(204).end();
    });
});

module.exports = router;
