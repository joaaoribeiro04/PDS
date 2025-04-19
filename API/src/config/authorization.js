/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
module.exports = (app) => {
  const authorize = (...requiredFlags) => {
    return (req, res, next) => {
      const userRoles = req.user.roles || {};

      const hasPermission = requiredFlags.some((flag) =>
        userRoles[flag] === true ? true : false
      );

      if (hasPermission) return next();

      return res.status(403).json({ error: "Action not permited" });
    };
  };

  return { authorize };
};
