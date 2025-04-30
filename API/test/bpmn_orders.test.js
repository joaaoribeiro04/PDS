/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../src/app");

const MAIN_ROUTE = "/orders";
var order;
var user;
var worker;
var admin;

beforeAll(async () => {
  const res = await app.services.user.findOne({ id: 2 });
  const adminRes = await app.services.user.findOne({ id: 1 });

  user = { ...res, roles: { isAdmin: false, isWorker: false } };
  user.token = jwt.encode(user, process.env.AUTH_SECRET);

  worker = { ...res, roles: { isAdmin: false, isWorker: true } };
  worker.token = jwt.encode(worker, process.env.AUTH_SECRET);

  admin = { ...adminRes, roles: { isAdmin: true, isWorker: false } };
  admin.token = jwt.encode(admin, process.env.AUTH_SECRET);

  order = await app.services.order.save({
    user_id: 1,
  });
});

// Business process tests - Original Workflow
describe("Order Workflow Simulation - Original", () => {
  let newOrder;

  test("Test #1 - Resident registers an order", async () => {
    const res = await request(app)
      .post(MAIN_ROUTE)
      .send({ user_id: user.id })
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("PENDING");
    newOrder = res.body;
  });

  test("Test #2 - Worker registers the arrival of the order and notifies the resident", async () => {
    const res = await request(app)
      .put(`${MAIN_ROUTE}/${newOrder.id}`)
      .send({ worker_id: worker.id, status: "DELIVERED" })
      .set("Authorization", `Bearer ${worker.token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Order updated");
    expect(res.body.data.status).toBe("DELIVERED");
    expect(res.body.data.worker_id).toBe(worker.id);
  });

  test("Test #3 - Worker updates the system after the resident picks up the order", async () => {
    const res = await request(app)
      .put(`${MAIN_ROUTE}/${newOrder.id}`)
      .send({ worker_id: worker.id, status: "COMPLETED" })
      .set("Authorization", `Bearer ${worker.token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Order updated");
    expect(res.body.data.status).toBe("COMPLETED");
  });
});

// Business process tests - Extended Workflow
describe("Order Workflow Simulation - Extended", () => {
  let newOrder;

  test("Test #1 - Resident registers an order", async () => {
    const res = await request(app)
      .post(MAIN_ROUTE)
      .send({ user_id: user.id })
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("PENDING");
    newOrder = res.body;
  });

  test("Test #2 - System validates the order", async () => {
    expect(newOrder).toHaveProperty("user_id");
    expect(newOrder).toHaveProperty("status");
    expect(newOrder.status).toBe("PENDING");
  });

  test("Test #3 - Worker verifies quality and updates order status", async () => {
    const isDamaged = false;

    if (isDamaged) {
      const res = await request(app)
        .put(`${MAIN_ROUTE}/${newOrder.id}`)
        .send({ worker_id: worker.id, status: "REJECTED" })
        .set("Authorization", `Bearer ${worker.token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Order updated");
      expect(res.body.data.status).toBe("REJECTED");
    } else {
      const res = await request(app)
        .put(`${MAIN_ROUTE}/${newOrder.id}`)
        .send({ worker_id: worker.id, status: "DELIVERED" })
        .set("Authorization", `Bearer ${worker.token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Order updated");
      expect(res.body.data.status).toBe("DELIVERED");
      expect(res.body.data.worker_id).toBe(worker.id);
    }
  });

  test("Test #4 - Resident picks up the order", async () => {
    const res = await request(app)
      .put(`${MAIN_ROUTE}/${newOrder.id}`)
      .send({ worker_id: worker.id, status: "COMPLETED" })
      .set("Authorization", `Bearer ${worker.token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Order updated");
    expect(res.body.data.status).toBe("COMPLETED");
  });
});

// Unit tests - Validations and authorization
describe("Order Unit Tests", () => {
  test("Test #1 - Should not create an order without user_id", async () => {
    const res = await request(app)
      .post(MAIN_ROUTE)
      .send({})
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("User ID is a required attribute");
  });

  test("Test #2 - Should return 401 if token is missing", async () => {
    const res = await request(app).post(MAIN_ROUTE).send({ user_id: user.id });

    expect(res.status).toBe(401);
  });

  test("Test #3 - Should return all orders for admin user", async () => {
    const res = await request(app)
      .get(MAIN_ROUTE)
      .set("Authorization", `Bearer ${admin.token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Test #4 - Should not create an order with an invalid user_id", async () => {
    const res = await request(app)
      .post(MAIN_ROUTE)
      .send({ user_id: -1 })
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Error saving order");
  });
});
