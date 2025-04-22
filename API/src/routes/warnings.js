/* eslint-disable no-undef */
module.exports = (app) => {
  const getAll = (req, res, next) => {
    app.services.warning
      .getAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const getById = (req, res, next) => {
    app.services.warning
      .findOne({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const create = async (req, res, next) => {
    try {
      let result = await app.services.warning.save(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  };

  const update = async (req, res, next) => {
    try {
      let result = await app.services.warning.update(req.params.id, req.body);
      res.status(200).json({ data: result[0], message: "Warning updated" });
    } catch (err) {
      return next(err);
    }
  };

  const remove = async (req, res, next) => {
    try {
      await app.services.warning.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      return next(err);
    }
  };

  return { getAll, getById, create, update, remove };
};
