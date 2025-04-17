/* eslint-disable no-undef */
module.exports = (app) => {
  const getByUserId = (req, res) => {
    app.services.role.getByUserId({ user_id: req.params.id }).then((role) => {
      res.status(200).json(role);
    });
  };

  const getAdmins = (req, res) => {
    app.services.role
      .getAdmins()
      .then((result) => res.status(200).json(result));
  };

  const getWorkers = (req, res) => {
    app.services.role
      .getWorkers()
      .then((result) => res.status(200).json(result));
  };

  const update = async (req, res) => {
    let result = await app.services.role.update(req.params.id, req.body);
    if (result.error) return res.status(400).json(result);
    res.status(200).json({ data: result[0], message: "role updated" });
  };

  return { getByUserId, getAdmins, getWorkers, update };
};
