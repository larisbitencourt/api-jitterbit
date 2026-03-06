require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB com sucesso! ✅'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.get('/', (req, res) => {
  res.send('API Jitterbit com MOngoDB conectada! 🚀');
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});