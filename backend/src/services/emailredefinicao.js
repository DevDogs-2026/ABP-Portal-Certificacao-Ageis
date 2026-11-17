const nodemailer = require('nodemailer');

async function enviarEmailRedefinicao(para, token) {
    const {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_SECURE,
        SMTP_USER,
        SMTP_PASS,
        SMTP_FROM,
        FRONTEND_ORIGIN,
    } = process.env;

    const configuracoes = {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_SECURE,
        SMTP_USER,
        SMTP_PASS,
        SMTP_FROM,
        FRONTEND_ORIGIN,
    };

    const ausentes = Object.entries(configuracoes)
        .filter(([, valor]) => !valor)
        .map(([nome]) => nome);

    if (ausentes.length > 0) {
        throw new Error(`Configurações de e-mail ausentes: ${ausentes.join(', ')}`);
    }

    const porta = Number(SMTP_PORT);

    if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
        throw new Error('SMTP_PORT deve ser uma porta válida.');
    }

    if (SMTP_SECURE !== 'true' && SMTP_SECURE !== 'false') {
        throw new Error('SMTP_SECURE deve ser "true" ou "false".');
    }

    const origemFrontend = new URL(FRONTEND_ORIGIN);

    if (!['http:', 'https:'].includes(origemFrontend.protocol)) {
        throw new Error('FRONTEND_ORIGIN deve usar HTTP ou HTTPS.');
    }

    const link = new URL('/src/redefinir-senha.html', origemFrontend);
    link.searchParams.set('token', token);

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: porta,
        secure: SMTP_SECURE === 'true',
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: SMTP_FROM,
        to: para,
        subject: 'Redefinição de senha',
        text: [
            'Recebemos uma solicitação para redefinir sua senha.',
            `Use este link para continuar: ${link.toString()}`,
            'Se você não solicitou a redefinição, ignore este e-mail.',
        ].join('\n\n'),
    });
}

module.exports = { enviarEmailRedefinicao };