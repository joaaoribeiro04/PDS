/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../../src/app");

const MAIN_ROUTE = "/invoices";
var invoice;

beforeAll(async () => {
  invoice = await app.services.invoice.save({
    user_id: 1,
    isPaid: false,
  });
});

test("Test #1 - List all invoices", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

test("Test #2 - List invoice by id", () => {
  return request(app)
    .get(`${MAIN_ROUTE}/${invoice.id}`)
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
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.data.isPaid).toBe(true);
    });
});
