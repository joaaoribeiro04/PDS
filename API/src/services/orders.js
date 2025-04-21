module.exports = (db) => {
  const getAll = () => db("orders");

  const getById = (filter) => db("orders").where(filter).first();

  const save = async (order) => {
    const { product, quantity, client_name } = order;
    if (!product || !quantity || !client_name) {
      return { error: "Campos obrigatórios em falta", status: 400 };
    }

    if (quantity <= 0) {
      return { error: "Quantity must be greater than zero", status: 400 };
    }

    return db("orders")
      .insert({ product, quantity, client_name })
      .returning("*");
  };

  const update = async (id, order) => {
    const { product, quantity, client_name } = order;
    if (!product || !quantity || !client_name) {
      return { error: "Campos obrigatórios em falta", status: 400 };
    }

    if (quantity <= 0) {
      return { error: "Quantity must be greater than zero", status: 400 };
    }

    const [updatedOrder] = await db("orders")
      .where({ id })
      .update({ product, quantity, client_name })
      .returning("*");

    if (!updatedOrder) {
      return { error: "Order not found", status: 404 };
    }

    return [updatedOrder];
  };

  const remove = async (id) => {
    const result = await db("orders").where({ id }).del();
    return result > 0 ? { success: true } : null;
  };

  const validate = async (id) => {
    const order = await getById({ id });
    if (!order) return { error: "Order not found", status: 404 };
    if (order.status !== "pending") {
      return { error: "Order has already been processed", status: 400 };
    }

    const [updatedOrder] = await db("orders")
      .where({ id })
      .update({ status: "validated" })
      .returning("*");

    await db("order_history").insert({
      order_id: id,
      status: "validated",
    });

    return updatedOrder;
  };

  const notify = async (id) => {
    const order = await getById({ id });
    if (!order) return { error: "Order not found", status: 404 };
    if (order.status !== "validated") {
      return {
        error: "Order needs to be validated first",
        status: 400,
      };
    }

    console.log(`Notifying resident: ${order.client_name}`);
    const [updatedOrder] = await db("orders")
      .where({ id })
      .update({ status: "notified" })
      .returning("*");

    await db("order_history").insert({
      order_id: id,
      status: "notified",
    });

    return updatedOrder;
  };

  const markAsDelivered = async (id) => {
    const order = await getById({ id });
    if (!order) return { error: "Order not found", status: 404 };
    if (order.status !== "notified") {
      return {
        error: "Order needs to be notified first",
        status: 400,
      };
    }

    const [updatedOrder] = await db("orders")
      .where({ id })
      .update({ status: "delivered" })
      .returning("*");

    await db("order_history").insert({
      order_id: id,
      status: "delivered",
    });

    return updatedOrder;
  };

  return {
    getAll,
    getById,
    save,
    update,
    remove,
    validate,
    notify,
    markAsDelivered,
  };
};
