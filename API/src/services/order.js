/* eslint-disable no-undef */

const validationError = require("../errors/validationError");
const date = new Date();
const dateString = `${String(date.getDate()).padStart(2, "0")}/${String(
  date.getMonth() + 1
).padStart(2, "0")}/${date.getFullYear()}`;

module.exports = (app) => {
  const findOne = (filter = {}) => {
    return app.db("orders").where(filter).first();
  };

  const getAll = () => {
    return app.db("orders").select("*");
  };

  const save = async (order) => {
    order.date = dateString;
    order.status = "PENDING";

    if (!order.user_id)
      throw new validationError("User ID is a required attribute");
    if (!order.date) throw new validationError("Date is a required attribute");
    if (!order.status)
      throw new validationError("Status is a required attribute");

    try {
      let [result] = await app
        .db("orders")
        .insert(order, ["id", "user_id", "date", "status"]);

      return result;
    } catch (err) {
      throw new validationError("Error saving order", err.message);
    }
  };

  const update = async (id, order) => {
    if (!order)
      throw new validationError("Order cannot be updated with empty data");

    let orderDb = await getAll().where({ id }).first();
    if (orderDb && orderDb.length == 0)
      throw new validationError("Order not found");

    if (
      orderDb.worker_id !== null &&
      order.worker_id !== null &&
      order.worker_id !== orderDb.worker_id
    )
      throw new validationError("Invalid worker ID");

    switch (orderDb.status) {
      case "PENDING":
        order.status = "DELIVERED";
        order.date = dateString;
        break;
      case "DELIVERED":
        order.status = "COMPLETED";
        order.date = dateString;
        break;
      default:
        throw new validationError("Invalid status");
    }

    return app
      .db("orders")
      .where({ id })
      .update(order, ["worker_id", "date", "status"]);
  };

  // const remove = async (id) => {
  //   const result = await db("orders").where({ id }).del();
  //   return result > 0 ? { success: true } : null;
  // };

  // const validate = async (id) => {
  //   const order = await getById({ id });
  //   if (!order) return { error: "Order not found", status: 404 };
  //   if (order.status !== "pending") {
  //     return { error: "Order has already been processed", status: 400 };
  //   }

  //   const [updatedOrder] = await db("orders")
  //     .where({ id })
  //     .update({ status: "validated" })
  //     .returning("*");

  //   await db("order_history").insert({
  //     order_id: id,
  //     status: "validated",
  //   });

  //   return updatedOrder;
  // };

  // const notify = async (id) => {
  //   const order = await getById({ id });
  //   if (!order) return { error: "Order not found", status: 404 };
  //   if (order.status !== "validated") {
  //     return {
  //       error: "Order needs to be validated first",
  //       status: 400,
  //     };
  //   }

  //   console.log(`Notifying resident: ${order.client_name}`);
  //   const [updatedOrder] = await db("orders")
  //     .where({ id })
  //     .update({ status: "notified" })
  //     .returning("*");

  //   await db("order_history").insert({
  //     order_id: id,
  //     status: "notified",
  //   });

  //   return updatedOrder;
  // };

  // const markAsDelivered = async (id) => {
  //   const order = await getById({ id });
  //   if (!order) return { error: "Order not found", status: 404 };
  //   if (order.status !== "notified") {
  //     return {
  //       error: "Order needs to be notified first",
  //       status: 400,
  //     };
  //   }

  //   const [updatedOrder] = await db("orders")
  //     .where({ id })
  //     .update({ status: "delivered" })
  //     .returning("*");

  //   await db("order_history").insert({
  //     order_id: id,
  //     status: "delivered",
  //   });

  //   return updatedOrder;
  // };

  return {
    findOne,
    getAll,
    save,
    update,
    // validate,
    // notify,
    // markAsDelivered,
  };
};
