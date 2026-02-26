require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.URL_DO_BANCO)
  .then(() => console.log('✅ Conectado ao MongoDB do Portfólio com sucesso!'))
  .catch((erro) => console.log('❌ Erro ao conectar:', erro));

const starSchema = new mongoose.Schema({
  count: { type: Number, default: 0 }
});
const Star = mongoose.model('Star', starSchema);

// Rota GET consertada (o código fica todo dentro das chaves)
app.get('/api/stars', async (req, res) => {
  try {
    let stars = await Star.findOne(); 
    if (!stars) return res.json({ count: 0 });
    res.json({ count: stars.count });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar dados' });
  }
});

// Rota POST (para adicionar a curtida)
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

const porta = process.env.PORTA || 3000;
app.listen(porta, () => {
  console.log(`🚀 API das Estrelas rodando na porta ${porta}`);
});