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
  
    const createComGastos = async (req, res) => {
      try {
        const gasto = await app.services.gastos.saveRandom();
    
        const total = gasto.agua + gasto.luz + gasto.gas + gasto.outros;
    
        const novaFatura = {
          id_residente: req.body.id_residente,
          id_gastos: gasto.id,
          total,
          data_emissao: req.body.data_emissao,
          data_limite: req.body.data_limite,
          status: req.body.status || "pendente"
        };
    
        const result = await app.services.faturas.save(novaFatura);
        if (result.error) return res.status(result.status || 400).json(result);
    
        res.status(201).json(result[0]);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno ao criar fatura com gastos" });
      }
    };

    return { getAll, getById, create, update, remove, createComGastos };
  };
