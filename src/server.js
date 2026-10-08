const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./banco.sqlite', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Banco de dados conectado.');
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, senha TEXT, perfil TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT, canalPedido TEXT, status TEXT, valorTotal REAL)`);
        const hash = bcrypt.hashSync('Senha@123', 10);
        db.run(`INSERT OR IGNORE INTO usuarios (email, senha, perfil) VALUES ('admin@raizes.com', ?, 'ADMIN')`, [hash]);
    }
});

const SECRET_KEY = 'chave_secreta_raizes_nordeste';

app.post('/auth/login', (req, res) => {
    const { email, senha } = req.body;
    db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], (err, user) => {
        if (!user || !bcrypt.compareSync(senha, user.senha)) {
            return res.status(401).json({ error: "UNAUTHORIZED", message: "Credenciais inválidas" });
        }
        const token = jwt.sign({ id: user.id, perfil: user.perfil }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ accessToken: token, user: { email: user.email, perfil: user.perfil } });
    });
});

app.post('/pedidos', (req, res) => {
    const { canalPedido, valorTotal } = req.body;
    const canaisValidos = ['APP', 'TOTEM', 'BALCAO', 'PICKUP', 'WEB'];
    if (!canaisValidos.includes(canalPedido)) {
        return res.status(400).json({ error: "BAD_REQUEST", message: "Canal inválido. Use TOTEM, APP, BALCAO, etc." });
    }
    db.run(`INSERT INTO pedidos (canalPedido, status, valorTotal) VALUES (?, 'AGUARDANDO_PAGAMENTO', ?)`, [canalPedido, valorTotal], function(err) {
        if (err) return res.status(500).json({ error: "DB_ERROR", message: "Erro ao salvar pedido" });
        res.status(201).json({ pedidoId: this.lastID, canalPedido, status: "AGUARDANDO_PAGAMENTO", valorTotal });
    });
});

app.post('/pagamentos/mock', (req, res) => {
    const { pedidoId, simularResultado } = req.body;
    if (simularResultado === 'APROVADO') {
        db.run(`UPDATE pedidos SET status = 'EM_PREPARO' WHERE id = ?`, [pedidoId]);
        res.json({ transacaoId: "MOCK-" + Math.floor(Math.random() * 10000), pedidoId, statusPagamento: "APROVADO", novoStatusPedido: "EM_PREPARO" });
    } else {
        res.status(422).json({ error: "PAYMENT_REJECTED", message: "Pagamento recusado pelo gateway mock" });
    }
});

app.listen(3000, () => {
    console.log('Servidor Raízes do Nordeste rodando em http://localhost:3000');
});