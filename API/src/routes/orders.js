module.exports = (app) => {
  const getAll = async (req, res) => {
    const result = await app.services.orders.getAll();
    res.status(200).json(result);
  };

  const getById = async (req, res) => {
    const result = await app.services.orders.getById({ id: req.params.id });
    if (!result) return res.status(404).json({ error: 'Encomenda não encontrada' });
    res.status(200).json(result);
  };

  const create = async (req, res) => {
    const result = await app.services.orders.save(req.body);
    if (result.error) return res.status(result.status || 400).json(result);
    res.status(201).json(result[0]);
  };

  const update = async (req, res) => {
    const result = await app.services.orders.update(req.params.id, req.body);
    if (!result.length) return res.status(404).json({ error: 'Encomenda não encontrada' });
    res.status(200).json({ data: result[0], message: 'Encomenda atualizada' });
  };

  const remove = async (req, res) => {
    const result = await app.services.orders.remove(req.params.id);
    if (!result) return res.status(404).json({ error: 'Encomenda não encontrada' });
    res.status(204).send();
  };

  return { getAll, getById, create, update, remove };
};
