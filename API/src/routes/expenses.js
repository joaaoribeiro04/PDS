/* eslint-disable no-undef */
module.exports = (app) => {
  const getAll = (req, res, next) => {
    app.services.expense
      .getAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const getById = (req, res, next) => {
    app.services.expense
      .findOne({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const create = async (req, res, next) => {
    try {
      let result = await app.services.expense.save(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  };

  return {
    getAll,
    getById,
    create,
  };
};
