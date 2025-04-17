/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../../src/app");

const MAIN_ROUTE = "roles";
const PREFIX_ROUTE = "/users";

test("Teste #1 - List role by user id", () => {
  return request(app)
    .get(`${PREFIX_ROUTE}/1/${MAIN_ROUTE}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
      expect(typeof res.body.isAdmin).toBe("boolean");
      expect(typeof res.body.isWorker).toBe("boolean");
    });
});

test("Teste #2 - List all admins", () => {
  return request(app)
    .get(`${PREFIX_ROUTE}/${MAIN_ROUTE}/admins`)
    .then((res) => {
      expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].isAdmin).toBe(true);
    });
});

test("Teste #3 - List all workers", () => {
  return request(app)
    .get(`${PREFIX_ROUTE}/${MAIN_ROUTE}/workers`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].isWorker).toBe(true);});
});

test("Teste #4 - Update role", () => {
    return request(app)
      .put(`${PREFIX_ROUTE}/1/${MAIN_ROUTE}`)
      .send({
        isAdmin: true,
        isWorker: true
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("role updated");
        expect(res.body.data.isAdmin).toBe(true);
      });
  });