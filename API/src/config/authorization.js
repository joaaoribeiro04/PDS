/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function deepEqual(a, b) {
  if (a === b) return true;
  if (a && b && typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a),
      keysB = Object.keys(b);
    return (
      keysA.length === keysB.length &&
      keysA.every((key) => keysB.includes(key) && deepEqual(a[key], b[key]))
    );
  }
  return false;
}

module.exports = (app) => {
  const authorize = (...requiredFlags) => {
    return async (req, res, next) => {
      try {
        const prevUserRoles = req.user.roles || {};

        const currentRoles = await app.services.role
          .findOne({ user_id: req.user.id })
          .then((role) => {
            if (role) return { isAdmin: role.isAdmin, isWorker: role.isWorker };
            return {};
          });

        const hasPermission = requiredFlags.some((flag) => {
          if (deepEqual(prevUserRoles, currentRoles)) {
            return prevUserRoles[flag] === true;
          }
          return currentRoles[flag] === true;
        });

        if (hasPermission) return next();

        return res.status(403).json({ error: "Action not permitted" });
      } catch (err) {
        return next(err);
      }
    };
  };

  return { authorize };
};
