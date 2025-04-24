/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const MAIN_ROUTE = "/orders";
var order;
var user;
var worker;

beforeAll(async () => {
  const res = await app.services.user.findOne({ id: 2 });

  user = { ...res, roles: { isAdmin: false, isWorker: false } };
  user.token = jwt.encode(user, process.env.AUTH_SECRET);

  worker = { ...res, roles: { isAdmin: false, isWorker: true } };
  worker.token = jwt.encode(worker, process.env.AUTH_SECRET);

  order = await app.services.order.save({
    user_id: 1,
  });
});

test("Test #1 - List all orders", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

test("Test #2 - List order by id", () => {
  return request(app)
    .get(`${MAIN_ROUTE}/1`)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });
});

test("Test #3 - Insert order", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      user_id: 1,
    })
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("PENDING");
    });
});

test("Test #4 - Update order", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/${order.id}`)
    .send({
      worker_id: 2,
    })
    .set("Authorization", `Bearer ${worker.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Order updated");
      expect(res.body.data.worker_id).toBe(2);
    });
});

describe("Order History Tracking", () => {
  // let orderId;
  // test("Test #7 (History) - Create order and verify history", async () => {
  //   const res = await request(app).post("/orders").send({
  //     product: "Laptop",
  //     quantity: 1,
  //     client_name: "John Doe",
  //   });
  //   expect(res.status).toBe(201);
  //   orderId = res.body.id;
  //   const history = await app.db("order_history").where({ order_id: orderId });
  //   expect(history.length).toBe(1);
  //   expect(history[0].status).toBe("pending");
  // });
  // test("Test #8 (History) - Validate order and verify history", async () => {
  //   const res = await request(app).put(`/orders/${orderId}/validate`);
  //   expect(res.status).toBe(200);
  //   const history = await app.db("order_history").where({ order_id: orderId });
  //   expect(history.length).toBe(2);
  //   expect(history[1].status).toBe("validated");
  // });
  // test("Test #9 (History) - Notify order and verify history", async () => {
  //   const res = await request(app).put(`/orders/${orderId}/notify`);
  //   expect(res.status).toBe(200);
  //   const history = await app.db("order_history").where({ order_id: orderId });
  //   expect(history.length).toBe(3);
  //   expect(history[2].status).toBe("notified");
  // });
  // test("Test #10 (History) - Deliver order and verify history", async () => {
  //   const res = await request(app).put(`/orders/${orderId}/deliver`);
  //   expect(res.status).toBe(200);
  //   const history = await app.db("order_history").where({ order_id: orderId });
  //   expect(history.length).toBe(4);
  //   expect(history[3].status).toBe("delivered");
  // });
  // test("Test #11 (History) - Error with invalid quantity", async () => {
  //   const res = await request(app).post("/orders").send({
  //     product: 'Monitor 24"',
  //     client_name: "Ana Martins",
  //     quantity: 0, // Invalid quantity
  //   });
  //   expect(res.status).toBe(400);
  //   expect(res.body.error).toBe("Quantity must be greater than zero");
  // });
  // test("Test #12 (History) - Error when notifying non-validated order", async () => {
  //   // Create a new order
  //   const resCreate = await request(app).post("/orders").send({
  //     product: "Test Product",
  //     quantity: 1,
  //     client_name: "Test Client",
  //   });
  //   const newOrderId = resCreate.body.id;
  //   // Try to notify without validating
  //   const res = await request(app).put(`/orders/${newOrderId}/notify`);
  //   expect(res.status).toBe(400);
  //   expect(res.body.error).toBe("Order needs to be validated first");
  // });
});
