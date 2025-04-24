/* eslint-disable no-undef */
module.exports = (app) => {
  const getAll = (req, res, next) => {
    app.services.order
      .getAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const getById = (req, res, next) => {
    app.services.order
      .findOne({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const create = async (req, res, next) => {
    try {
      let result = await app.services.order.save(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  };

  const update = async (req, res, next) => {
    try {
      let result = await app.services.order.update(req.params.id, req.body);
      res.status(200).json({ data: result[0], message: "Order updated" });
    } catch (err) {
      return next(err);
    }
  };

  // const remove = async (req, res) => {
  //   const result = await app.services.orders.remove(req.params.id);
  //   if (!result)
  //     return res.status(404).json({ error: "Encomenda não encontrada" });
  //   res.status(204).send();
  // };

  // const validate = async (req, res) => {
  //   const result = await app.services.orders.validate(req.params.id);
  //   if (result.error) return res.status(result.status || 400).json(result);
  //   res.status(200).json(result);
  // };

  // const notify = async (id) => {
  //   try {
  //     const order = await app.services.orders.getById({ id });

  //     if (!order) {
  //       console.error("Order not found:", id);
  //       return { error: "Order not found", status: 404 };
  //     }

  //     if (order.status !== "validated") {
  //       console.error("Order not validated:", order);
  //       return {
  //         error: "Order needs to be validated first",
  //         status: 400,
  //       };
  //     }

  //     console.log(`Notifying resident: ${order.client_name}`);
  //     const [updatedOrder] = await app
  //       .db("orders")
  //       .where({ id })
  //       .update({ status: "notified" })
  //       .returning("*");

  //     await app.db("order_history").insert({
  //       order_id: id,
  //       status: "notified",
  //     });

  //     return updatedOrder;
  //   } catch (err) {
  //     console.error("Error in notify function:", err);
  //     throw err;
  //   }
  // };

  // const markAsDelivered = async (req, res) => {
  //   const result = await app.services.orders.markAsDelivered(req.params.id);
  //   if (result.error) return res.status(result.status || 400).json(result);
  //   res.status(200).json(result);
  // };

  return {
    getAll,
    getById,
    create,
    update,
    // remove,
    // validate,
    // notify,
    // markAsDelivered,
  };
};
