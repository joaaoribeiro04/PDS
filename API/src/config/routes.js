/* eslint-disable no-undef */
module.exports = (app) => {
  app.route("/auth/signin").post(app.routes.auths.signin);

  app
    .route("/users")
    .all(app.config.passport.authenticate())
    .get(app.routes.users.getAll)
    .post(
      app.config.authorization.authorize("isAdmin"),
      app.routes.users.create
    );

  app
    .route("/users/:id")
    .all(app.config.passport.authenticate())
    .get(app.routes.users.getById)
    .put(app.routes.users.update)
    .delete(app.routes.users.remove);

  app
    .route("/users/roles/admins")
    .all(app.config.passport.authenticate())
    .get(app.routes.roles.getAdmins);

  app
    .route("/users/roles/workers")
    .all(app.config.passport.authenticate())
    .get(app.routes.roles.getWorkers);

  app
    .route("/users/:id/roles")
    .all(app.config.passport.authenticate())
    .get(app.routes.roles.getByUserId)
    .put(
      app.config.authorization.authorize("isAdmin"),
      app.routes.roles.update
    );

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
    .route("/warnings")
    .all(app.config.passport.authenticate())
    .get(app.routes.warnings.getAll)
    .post(
      app.config.authorization.authorize("isAdmin"),
      app.routes.warnings.create
    );

  app
    .route("/warnings/:id")
    .all(app.config.passport.authenticate())
    .get(app.routes.warnings.getById)
    .put(
      app.config.authorization.authorize("isAdmin"),
      app.routes.warnings.update
    )
    .delete(
      app.config.authorization.authorize("isAdmin"),
      app.routes.warnings.remove
    );

  app
    .route("/orders")
    .all(app.config.passport.authenticate())
    .get(app.routes.orders.getAll)
    .post(app.routes.orders.create);

  app
    .route("/orders/:id")
    .all(app.config.passport.authenticate())
    .get(app.routes.orders.getById)
    .put(
      app.config.authorization.authorize("isWorker"),
      app.routes.orders.update
    );

  app
    .route("/requests")
    .all(app.config.passport.authenticate())
    .get(app.routes.requests.getAll)
    .post(app.routes.requests.create);

  app
    .route("/requests/:id")
    .all(app.config.passport.authenticate())
    .get(app.routes.requests.getById)
    .put(
      app.config.authorization.authorize("isAdmin"),
      app.routes.requests.update
    );

  app
    .route("/invoices")
    .all(app.config.passport.authenticate())
    .get(app.routes.invoices.getAll)
    .post(
      app.config.authorization.authorize("isAdmin"),
      app.routes.invoices.create
    );

  app
    .route("/invoices/:id")
    .all(app.config.passport.authenticate())
    .get(app.routes.invoices.getById)
    .put(
      app.config.authorization.authorize("isAdmin"),
      app.routes.invoices.update
    );

  app
    .route("/expenses")
    .all(app.config.passport.authenticate())
    .get(app.routes.expenses.getAll);

  app
    .route("/expenses/:id")
    .all(app.config.passport.authenticate())
    .get(app.routes.expenses.getById);
};
