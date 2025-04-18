/* eslint-disable no-undef */
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt-nodejs");
const validationError = require("../errors/validationError");

module.exports = (app) => {
  const signin = async (req, res, next) => {
    app.services.user
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) throw new validationError("Authentication failed.");
        if (bcrypt.compareSync(req.body.password, user.password)) {
          // #TODO procurar roles do user e adicionar ao payload

          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
          };

          const token = jwt.encode(payload, process.env.AUTH_SECRET);
          res.status(200).json({ token });
        } else throw new validationError("Authentication failed.");
      })
      .catch((err) => next(err));
  };

  return { signin };
};
