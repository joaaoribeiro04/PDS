/* eslint-disable no-undef */
module.exports = (app) => {
  const getByUserId = (filter = {}) => {
    return app.db("roles").where(filter).first();
  };

  const getAdmins = () => {
    return app.db("roles").where({ isAdmin: true }).select();
  };

  const getWorkers = () => {
    return app.db("roles").where({ isWorker: true }).select();
  };

  const update = async (user_id, role) => {
    const existing = await app.db("roles").where({ user_id }).first();
    if (!existing) {
      throw new validationError("User not found");
    }

    return app.db("roles").where({ user_id }).update(role, "*");
  };

  return { getByUserId, getAdmins, getWorkers, update };
};
