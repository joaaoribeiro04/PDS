/* eslint-disable no-undef */
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt-nodejs");
const validationError = require("../errors/validationError");

module.exports = (app) => {
  const signin = async (req, res, next) => {
    app.services.user
      .findOne({ email: req.body.email })
      .then(async (user) => {
        if (!user) throw new validationError("Authentication failed.");
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const userRole = await app.services.role.findOne({
            user_id: user.id,
          });
          if (!userRole) throw new validationError("Authentication failed.");

          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            roles: {
              isAdmin: userRole.isAdmin,
              isWorker: userRole.isWorker,
            },
          };

          const token = jwt.encode(payload, process.env.AUTH_SECRET);
          res.status(200).json({ token });
        } else throw new validationError("Authentication failed.");
      })
      .catch((err) => next(err));
  };

  return { signin };
};
