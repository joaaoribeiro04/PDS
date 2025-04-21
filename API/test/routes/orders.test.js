/*
const request = require("supertest");
const app = require("../../src/app");

beforeAll(async () => {
  // Clear tables before tests
  await app.db("orders").del();
  await app.db("order_history").del();
});

describe("Order CRUD Operations", () => {
  let orderId;

  test("Test #1 (Orders) - Create a new order", async () => {
    const res = await request(app).post("/orders").send({
      product: 'Monitor 24"',
      quantity: 2,
      client_name: "Ana Martins",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    orderId = res.body.id;
  });

  test("Test #2 (Orders) - List all orders", async () => {
    const res = await request(app).get("/orders");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Test #3 (Orders) - Get order by ID", async () => {
    const res = await request(app).get(`/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("product", 'Monitor 24"');
  });

  test("Test #4 (Orders) - Update an order", async () => {
    const res = await request(app).put(`/orders/${orderId}`).send({
      product: 'Monitor 27"',
      quantity: 3,
      client_name: "Ana M.",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });

    const updated = await request(app).get(`/orders/${orderId}`);
    expect(updated.body).toHaveProperty("product", 'Monitor 27"');
  });

  test("Test #5 (Orders) - Delete an order", async () => {
    const res = await request(app).delete(`/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });

    const deleted = await request(app).get(`/orders/${orderId}`);
    expect(deleted.status).toBe(404);
  });

  test("Test #6 (Orders) - Error when creating order without required data", async () => {
    const res = await request(app).post("/orders").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("Order History Tracking", () => {
  let orderId;

  test("Test #7 (History) - Create order and verify history", async () => {
    const res = await request(app).post("/orders").send({
      product: "Laptop",
      quantity: 1,
      client_name: "John Doe",
    });

    expect(res.status).toBe(201);
    orderId = res.body.id;

    const history = await app.db("order_history").where({ order_id: orderId });
    expect(history.length).toBe(1);
    expect(history[0].status).toBe("pending");
  });

  test("Test #8 (History) - Validate order and verify history", async () => {
    const res = await request(app).put(`/orders/${orderId}/validate`);
    expect(res.status).toBe(200);

    const history = await app.db("order_history").where({ order_id: orderId });
    expect(history.length).toBe(2);
    expect(history[1].status).toBe("validated");
  });

  test("Test #9 (History) - Notify order and verify history", async () => {
    const res = await request(app).put(`/orders/${orderId}/notify`);
    expect(res.status).toBe(200);

    const history = await app.db("order_history").where({ order_id: orderId });
    expect(history.length).toBe(3);
    expect(history[2].status).toBe("notified");
  });

  test("Test #10 (History) - Deliver order and verify history", async () => {
    const res = await request(app).put(`/orders/${orderId}/deliver`);
    expect(res.status).toBe(200);

    const history = await app.db("order_history").where({ order_id: orderId });
    expect(history.length).toBe(4);
    expect(history[3].status).toBe("delivered");
  });

  test("Test #11 (History) - Error with invalid quantity", async () => {
    const res = await request(app).post("/orders").send({
      product: 'Monitor 24"',
      client_name: "Ana Martins",
      quantity: 0, // Invalid quantity
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Quantity must be greater than zero");
  });

  test("Test #12 (History) - Error when notifying non-validated order", async () => {
    // Create a new order
    const resCreate = await request(app).post("/orders").send({
      product: "Test Product",
      quantity: 1,
      client_name: "Test Client",
    });
    const newOrderId = resCreate.body.id;

    // Try to notify without validating
    const res = await request(app).put(`/orders/${newOrderId}/notify`);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Order needs to be validated first");
  });
});
*/