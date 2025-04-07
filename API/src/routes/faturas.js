module.exports = (app) => {
    const getAll = (req, res) => {
      app.services.faturas.getAll().then((result) => res.status(200).json(result));
    };
  
    const getById = (req, res) => {
      app.services.faturas.getById({ id: req.params.id }).then((result) => {
        if (!result)
          return res.status(404).json({ error: "Fatura não encontrada" });
        res.status(200).json(result);
      });
    };
  
    const create = async (req, res) => {
      const result = await app.services.faturas.save(req.body);
      if (result.error) return res.status(result.status || 400).json(result);
      res.status(201).json(result[0]);
    };
  
    const update = async (req, res) => {
      const result = await app.services.faturas.update(req.params.id, req.body);
      if (result.error) return res.status(400).json(result);
      res.status(200).json({ data: result[0], message: "Fatura atualizada" });
    };
  
    const remove = async (req, res) => {
      const result = await app.services.faturas.remove(req.params.id);
      if (result.error) return res.status(400).json(result);
      res.status(204).send();
    };
  
    return { getAll, getById, create, update, remove };
  };
