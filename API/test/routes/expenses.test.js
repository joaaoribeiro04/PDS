/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const MAIN_ROUTE = "/expenses";
var user;

beforeAll(async () => {
  const res = await app.services.user.findOne({ id: 1 });

  user = { ...res, roles: { isAdmin: false, isWorker: false } };
  user.token = jwt.encode(user, process.env.AUTH_SECRET);
});

test("Test #1 - List all expenses", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

test("Test #2 - List expense by id", () => {
  return request(app)
    .get(`${MAIN_ROUTE}/1`)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
    });
});
