const express = require('express');
const bcrypt = require('bcryptjs');
const { rateLimit } = require('express-rate-limit');
const pool = require('../db/pool');

const router = express.Router();

const limitarTentativasLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limite de 5 tentativas
    standardHeaders: true, // Retorna informações de limite de taxa nos cabeçalhos `RateLimit-*`
    legacyHeaders: false, // Desativa os cabeçalhos `X-RateLimit-*`
    message: 'Muitas tentativas de login. Por favor, tente novamente mais tarde.'
});

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
