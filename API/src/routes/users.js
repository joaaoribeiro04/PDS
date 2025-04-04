/* eslint-disable no-undef */
module.exports = (app) => {
  const getAll = (req, res) => {
    app.services.user.getAll().then((result) => res.status(200).json(result));
  };

  const getById = (req, res) => {
    app.services.user
      .getById({ id: req.params.id })
      .then((result) => res.status(200).json(result));
  };

  const create = async (req, res) => {
    let result = await app.services.user.save(req.body);
    if (result.error) return res.status(400).json(result);
    res.status(201).json(result[0]);
  };

  const update = async (req, res) => {
    let result = await app.services.user.update(req.params.id, req.body);
    if (result.error) return res.status(400).json(result);
    res.status(200).json({ data: result[0], message: "Utilizador atualizado" });
  };

  const remove = async (req, res) => {
    let result = await app.services.user.remove(req.params.id);
    if (result.error) return res.status(400).json(result);
    res.status(204).send();
  };

  return { getAll, getById, create, update, remove };
};
