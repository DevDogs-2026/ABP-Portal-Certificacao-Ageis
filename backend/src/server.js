// a server.js é o ponto de entrada do backend, responsável 
// por configurar e iniciar o servidor Express, gerenciar sessões e definir rotas.

require('dotenv').config();

const express = require('express'); 
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const pool = require('./db/pool');
const authRoutes = require('./routes/authRoutes');

const app = express();
const porta = process.env.PORT || 3000;
const producao = process.env.NODE_ENV === 'production';

const origemFrontend =
    process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5500';

app.use('/api', (req, res, next) => {
    const origem = req.get('Origin');

    if (origem && origem !== origemFrontend) {
        return res.status(403).json({ mensagem: 'Origem não permitida' });
    }

    if (origem) {
        res.setHeader('Access-Control-Allow-Origin', origem);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Vary', 'Origin');
    }

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

if(!process.env.SESSION_SECRET) {
    console.error('A variável de ambiente SESSION_SECRET não está definida.');
    process.exit(1);
}

if (producao) {
    app.set('trust proxy', 1);
}

app.use(express.json({ limit: '10kb'}));

app.use(session({
    name: 'portal.sid',
    store: new pgSession({
        pool,
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: producao,
        maxAge: 8 * 60 * 60 * 1000, // 8 horas
        path: '/',
    },
}));

app.use('/api/auth', authRoutes);
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
});

async function iniciarServidor() {
    await pool.query('SELECT 1'); // Testa a conexão com o banco de dados
    
    app.listen(porta, () => {
        console.log(`Servidor rodando na porta http://localhost:${porta}`);
    });
}

iniciarServidor().catch((error) => {
    console.error('Erro ao iniciar o servidor:', error);
    process.exitCode = 1;
});