/* eslint-disable no-undef */
module.exports = (app) => {
  const getAll = (req, res, next) => {
    app.services.order
      .getAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const getById = (req, res, next) => {
    app.services.order
      .findOne({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const create = async (req, res, next) => {
    try {
      let result = await app.services.order.save(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  };

  const update = async (req, res, next) => {
    try {
      let result = await app.services.order.update(req.params.id, req.body);
      res.status(200).json({ data: result[0], message: "Order updated" });
    } catch (err) {
      return next(err);
    }
  };

  return {
    getAll,
    getById,
    create,
    update,
  };
};
