const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('API Jitterbit Online! 🚀');
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});