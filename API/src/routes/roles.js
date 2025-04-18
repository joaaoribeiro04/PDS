/* eslint-disable no-undef */
module.exports = (app) => {
  const getByUserId = (req, res, next) => {
    app.services.role
      .getByUserId({ user_id: req.params.id })
      .then((role) => res.status(200).json(role))
      .catch((err) => next(err));
  };

  const getAdmins = (req, res, next) => {
    app.services.role
      .getAdmins()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const getWorkers = (req, res, next) => {
    app.services.role
      .getWorkers()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const update = async (req, res, next) => {
    try {
      let result = await app.services.role.update(req.params.id, req.body);
      res.status(200).json({ data: result[0], message: "role updated" });
    } catch (err) {
      return next(err);
    }
  };

  return { getByUserId, getAdmins, getWorkers, update };
};
