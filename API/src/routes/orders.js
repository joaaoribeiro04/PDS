module.exports = (app) => {
  const getAll = async (req, res) => {
    const result = await app.services.orders.getAll();
    res.status(200).json(result);
  };

  const getById = async (req, res) => {
    const result = await app.services.orders.getById({ id: req.params.id });
    if (!result)
      return res.status(404).json({ error: "Encomenda não encontrada" });
    res.status(200).json(result);
  };

  const create = async (req, res) => {
    const result = await app.services.orders.save(req.body);
    if (result.error) return res.status(result.status || 400).json(result);
    res.status(201).json(result[0]);
  };

  const update = async (req, res) => {
    const result = await app.services.orders.update(req.params.id, req.body);
    if (!result.length)
      return res.status(404).json({ error: "Encomenda não encontrada" });
    res.status(200).json({ data: result[0], message: "Encomenda atualizada" });
  };

  const remove = async (req, res) => {
    const result = await app.services.orders.remove(req.params.id);
    if (!result)
      return res.status(404).json({ error: "Encomenda não encontrada" });
    res.status(204).send();
  };

  const validate = async (req, res) => {
    const result = await app.services.orders.validate(req.params.id);
    if (result.error) return res.status(result.status || 400).json(result);
    res.status(200).json(result);
  };

  const notify = async (id) => {
    try {
      const order = await app.services.orders.getById({ id });

      if (!order) {
        console.error("Order not found:", id);
        return { error: "Order not found", status: 404 };
      }

      if (order.status !== "validated") {
        console.error("Order not validated:", order);
        return {
          error: "Order needs to be validated first",
          status: 400,
        };
      }

      console.log(`Notifying resident: ${order.client_name}`);
      const [updatedOrder] = await app
        .db("orders")
        .where({ id })
        .update({ status: "notified" })
        .returning("*");

      await app.db("order_history").insert({
        order_id: id,
        status: "notified",
      });

      return updatedOrder;
    } catch (err) {
      console.error("Error in notify function:", err);
      throw err;
    }
  };

  const markAsDelivered = async (req, res) => {
    const result = await app.services.orders.markAsDelivered(req.params.id);
    if (result.error) return res.status(result.status || 400).json(result);
    res.status(200).json(result);
  };

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    validate,
    notify,
    markAsDelivered,
  };
};
