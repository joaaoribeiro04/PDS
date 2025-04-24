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
    .route("/faturas")
    .get(app.routes.faturas.getAll)
    .post(app.routes.faturas.create);

  app
    .route("/faturas/:id")
    .get(app.routes.faturas.getById)
    .put(app.routes.faturas.update)
    .delete(app.routes.faturas.remove);

  // app.route("/orders/:id/validate").put(app.routes.orders.validate); // Validar uma encomenda

  // app.put("/orders/:orderId/notify", async (req, res) => {
  //   try {
  //     const { orderId } = req.params;
  //     console.log("Notifying order:", orderId);

  //     const updatedOrder = await app.routes.orders.notify(orderId);
  //     res.status(200).json(updatedOrder);
  //   } catch (err) {
  //     console.error("Error notifying order:", err);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });

  // app.route("/orders/:id/deliver").put(app.routes.orders.markAsDelivered); // Marcar como entregue
};
