/* eslint-disable no-undef */
const request = require("supertest");

const app = require("../../src/app");

const MAIN_ROUTE = "/expenses";

test("Test #1 - List all expenses", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

test("Test #2 - List expense by id", () => {
  return request(app)
    .get(`${MAIN_ROUTE}/1`)
    .then((res) => {
      expect(res.status).toBe(200);
    });
});
