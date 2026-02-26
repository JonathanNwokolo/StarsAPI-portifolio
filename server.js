require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// IMPORTANTE: O CORS permite que o seu site da Vercel converse com o Render
app.use(cors());
app.use(express.json());

// Conexão com o Banco
mongoose.connect(process.env.URL_DO_BANCO)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch((erro) => console.log('❌ Erro no MongoDB:', erro));

const starSchema = new mongoose.Schema({
  count: { type: Number, default: 0 }
});
const Star = mongoose.model('Star', starSchema);

// Rota de teste (Abra o link da API no navegador para ver isso)
app.get('/', (req, res) => {
  res.send('API de Estrelas está viva e operante! 🚀');
});

// Rota GET (Para o site ler o número de estrelas)
app.get('/api/stars', async (req, res) => {
  try {
    let stars = await Star.findOne(); 
    if (!stars) return res.json({ count: 0 });
    res.json({ count: stars.count });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar dados' });
  }
});

// Rota POST (Para o site adicionar uma estrela - ESSA É A QUE DEU 404!)
app.post('/api/stars', async (req, res) => {
  try {
    let stars = await Star.findOne();
    if (!stars) {
      stars = new Star({ count: 1 });
    } else {
      stars.count += 1;
    }
    await stars.save();
    res.json({ count: stars.count });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao salvar dados' });
  }
});

// IMPORTANTE PARA O RENDER: Ele usa a variável PORT ou a 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});