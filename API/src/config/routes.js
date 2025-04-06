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

  app
    .route("/announcements")
    .get(app.routes.announcements.getAll)
    .post(app.routes.announcements.create);

  app
    .route("/announcements/:id")
    .get(app.routes.announcements.getById)
    .put(app.routes.announcements.update)
    .delete(app.routes.announcements.remove);
};
