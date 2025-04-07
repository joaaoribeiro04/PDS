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

    app
    .route("/faturas")
    .get(app.routes.faturas.getAll)
    .post(app.routes.faturas.create);

  app
    .route("/faturas/:id")
    .get(app.routes.faturas.getById)
    .put(app.routes.faturas.update)
    .delete(app.routes.faturas.remove);

    app
    .route("/orders")
    .get(app.routes.orders.getAll)
    .post(app.routes.orders.create);

  app
    .route("/orders/:id")
    .get(app.routes.orders.getById)
    .put(app.routes.orders.update)
    .delete(app.routes.orders.remove);
};