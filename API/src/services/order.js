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

  return {
    findOne,
    getAll,
    save,
    update,
  };
};
