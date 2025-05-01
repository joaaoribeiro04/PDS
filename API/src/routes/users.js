/* eslint-disable no-undef */
module.exports = (app) => {
  const getAll = (req, res, next) => {
    app.services.user
      .getAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const getById = (req, res, next) => {
    app.services.user
      .getById({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const create = async (req, res, next) => {
    try {
      let result = await app.services.user.save(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  };

  const update = async (req, res, next) => {
    try {
      let result = await app.services.user.update(req.params.id, req.body);
      res
        .status(200)
        .json({ data: result[0], message: "User updated" });
    } catch (err) {
      return next(err);
    }
  };

  const remove = async (req, res, next) => {
    try {
      await app.services.user.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      return next(err);
    }
  };

  return { getAll, getById, create, update, remove };
};
