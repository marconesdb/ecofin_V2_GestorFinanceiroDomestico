
/**
 * Backend Node.js para EcoFin
 * Comandos para rodar: 
 * 1. npm init -y
 * 2. npm install express mysql2 dotenv cors
 * 3. node server.js
 */
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Pool de Conexão MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecofin_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- Endpoints de Despesas ---

// Listar todas as despesas
app.get('/api/expenses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar despesas: ' + err.message });
  }
});

// Adicionar nova despesa
app.post('/api/expenses', async (req, res) => {
  const { id, description, amount, category, date } = req.body;
  try {
    await pool.query(
      'INSERT INTO expenses (id, description, amount, category, date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, description, amount, category, date, 'usuario-padrao']
    );
    res.status(201).json({ message: 'Despesa criada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar despesa: ' + err.message });
  }
});

// Deletar despesa
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Despesa removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover despesa: ' + err.message });
  }
});

// --- Endpoints de Metas ---

app.get('/api/budgets', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM budget_goals');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar metas: ' + err.message });
  }
});

app.put('/api/budgets', async (req, res) => {
  const { category, limit } = req.body;
  try {
    await pool.query(
      'INSERT INTO budget_goals (category, monthly_limit, user_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE monthly_limit = ?',
      [category, limit, 'usuario-padrao', limit]
    );
    res.json({ message: 'Meta atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar meta: ' + err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor EcoFin rodando na porta ${PORT}`);
});
