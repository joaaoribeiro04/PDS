/* eslint-disable no-undef */
module.exports = (app) => {
  app
    .route("/users")
    .get(app.routes.users.getAll)
    .post(app.routes.users.create);

  app
    .route("/users/:id")
    .get(app.routes.users.getById)
    .put(app.routes.users.update)
    .delete(app.routes.users.remove);
};
