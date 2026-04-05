const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Todas as rotas servem o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Banco de dados
const DB_FILE = path.join(__dirname, 'database.json');
let db = { users: [], products: [], transactions: [], chats: [] };

if (fs.existsSync(DB_FILE)) {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
} else {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function saveDb() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

app.get('/api/db', (req, res) => res.json(db));

app.post('/api/db', (req, res) => {
    db = req.body;
    saveDb();
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Breakthesystem Store rodando na porta ${PORT}`);
});