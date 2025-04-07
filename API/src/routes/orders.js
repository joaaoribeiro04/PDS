module.exports = app => {
    const db = app.db;
  
    // GET /orders - Listar todas as encomendas
    app.get('/orders', async (req, res) => {
      try {
        const orders = await db('orders').select('*');
        res.status(200).json(orders);
      } catch (err) {
        res.status(500).json({ error: 'Erro ao obter encomendas' });
      }
    });
  
    // GET /orders/:id - Obter uma encomenda específica
    app.get('/orders/:id', async (req, res) => {
      try {
        const order = await db('orders').where({ id: req.params.id }).first();
        if (!order) return res.status(404).json({ error: 'Encomenda não encontrada' });
        res.status(200).json(order);
      } catch (err) {
        res.status(500).json({ error: 'Erro ao obter encomenda' });
      }
    });
  
    // POST /orders - Inserir uma nova encomenda
    app.post('/orders', async (req, res) => {
      try {
        const { product, quantity, client_name } = req.body;
        if (!product || !quantity || !client_name) {
          return res.status(400).json({ error: 'Campos obrigatórios em falta' });
        }
  
        const [id] = await db('orders').insert({ product, quantity, client_name }).returning('id');
        res.status(201).json({ id });
      } catch (err) {
        res.status(500).json({ error: 'Erro ao inserir encomenda' });
      }
    });
  
    // PUT /orders/:id - Atualizar uma encomenda
    app.put('/orders/:id', async (req, res) => {
      try {
        const { product, quantity, client_name } = req.body;
        const updated = await db('orders')
          .where({ id: req.params.id })
          .update({ product, quantity, client_name });
  
        if (!updated) return res.status(404).json({ error: 'Encomenda não encontrada' });
  
        res.status(200).json({ success: true });
      } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar encomenda' });
      }
    });
  
    // DELETE /orders/:id - Remover uma encomenda
    app.delete('/orders/:id', async (req, res) => {
      try {
        const deleted = await db('orders').where({ id: req.params.id }).del();
  
        if (!deleted) return res.status(404).json({ error: 'Encomenda não encontrada' });
  
        res.status(200).json({ success: true });
      } catch (err) {
        res.status(500).json({ error: 'Erro ao remover encomenda' });
      }
    });
  };
  
  