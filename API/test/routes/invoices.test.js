/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const MAIN_ROUTE = "/invoices";
var invoice;
var user;
var admin;

beforeAll(async () => {
  const res = await app.services.user.findOne({ id: 1 });

  user = { ...res, roles: { isAdmin: false, isWorker: false } };
  user.token = jwt.encode(user, process.env.AUTH_SECRET);

  admin = { ...res, roles: { isAdmin: true, isWorker: false } };
  admin.token = jwt.encode(admin, process.env.AUTH_SECRET);

  invoice = await app.services.invoice.save({
    user_id: 1,
    isPaid: false,
  });
});

test("Test #1 - List all invoices", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

test("Test #2 - List invoice by id", () => {
  return request(app)
    .get(`${MAIN_ROUTE}/${invoice.id}`)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(invoice.id);
    });
});

test("Test #3 - Insert invoice", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      user_id: 1,
      isPaid: false,
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.user_id).toBe(1);
    });
});

test("Test #4 - Update invoice", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/${invoice.id}`)
    .send({
      isPaid: true,
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.data.isPaid).toBe(true);
    });
});
