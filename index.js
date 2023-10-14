const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`[${req.method}] - ${req.url}`);
  next();
});

const orders = [];

// Middleware para verificar se o ID existe
function checkOrderExists(req, res, next) {
  const { id } = req.params;
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  req.order = order;
  next();
}

// Rota para criar um novo pedido
app.post('/order', (req, res) => {
  const { order, clientName, price } = req.body;
  const id = uuidv4();
  const newOrder = {
    id,
    order,
    clientName,
    price,
    status: 'Em preparação',
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Rota para listar todos os pedidos
app.get('/order', (req, res) => {
  res.json(orders);
});

// Rota para atualizar um pedido
app.put('/order/:id', checkOrderExists, (req, res) => {
  const { order, clientName, price } = req.body;
  const { id } = req.params;
  const updatedOrder = {
    ...req.order,
    order,
    clientName,
    price,
  };
  orders[orders.indexOf(req.order)] = updatedOrder;
  res.json(updatedOrder);
});

// Rota para deletar um pedido
app.delete('/order/:id', checkOrderExists, (req, res) => {
  const { id } = req.params;
  const index = orders.indexOf(req.order);
  orders.splice(index, 1);
  res.json({ message: 'Pedido excluído com sucesso' });
});

// Rota para obter um pedido específico
app.get('/order/:id', checkOrderExists, (req, res) => {
  res.json(req.order);
});

// Rota para marcar um pedido como "Pronto"
app.patch('/order/:id', checkOrderExists, (req, res) => {
  req.order.status = 'Pronto';
  res.json(req.order);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// p usar o nodemon usar npm run dev// 