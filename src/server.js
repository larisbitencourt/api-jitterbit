require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Jitterbit com MOngoDB conectada! 🚀');
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});