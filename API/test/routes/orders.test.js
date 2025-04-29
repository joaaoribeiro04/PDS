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

describe("Basic Order Operations", () => {
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
      .get(`${MAIN_ROUTE}/${order.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(order.id);
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
});

// Business process tests - Original Workflow
describe("Order Workflow Simulation - Original", () => {
  let newOrder;

  test("Step #1 - Resident registers an order", async () => {
    const res = await request(app)
      .post(MAIN_ROUTE)
      .send({ user_id: user.id })
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("PENDING");
    newOrder = res.body;
  });

  test("Step #2 - Worker registers the arrival of the order and notifies the resident", async () => {
    const res = await request(app)
      .put(`${MAIN_ROUTE}/${newOrder.id}`)
      .send({ worker_id: worker.id, status: "DELIVERED" })
      .set("Authorization", `Bearer ${worker.token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Order updated");
    expect(res.body.data.status).toBe("DELIVERED");
    expect(res.body.data.worker_id).toBe(worker.id);
  });

  test("Step #3 - Worker updates the system after the resident picks up the order", async () => {
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
// This workflow includes a quality check step before the order is delivered to the resident.
describe("Order Workflow Simulation - Extended", () => {
  let newOrder;

  test("Step #1 - Resident registers an order", async () => {
    const res = await request(app)
      .post(MAIN_ROUTE)
      .send({ user_id: user.id })
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("PENDING");
    newOrder = res.body;
  });

  test("Step #2 - System validates the order", async () => {
    expect(newOrder).toHaveProperty("user_id");
    expect(newOrder).toHaveProperty("status");
    expect(newOrder.status).toBe("PENDING");
  });

  test("Step #3 - Worker verifies quality and updates order status", async () => {
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

  test("Step #4 - Resident picks up the order", async () => {
    const res = await request(app)
      .put(`${MAIN_ROUTE}/${newOrder.id}`)
      .send({ worker_id: worker.id, status: "COMPLETED" })
      .set("Authorization", `Bearer ${worker.token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Order updated");
    expect(res.body.data.status).toBe("COMPLETED");
  });
});
