/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const MAIN_ROUTE = "roles";
const PREFIX_ROUTE = "/users";
var user;
var admin;

beforeAll(async () => {
  const res = await app.services.user.findOne({ id: 1 });

  user = { ...res, roles: { isAdmin: false, isWorker: false } };
  user.token = jwt.encode(user, process.env.AUTH_SECRET);

  admin = { ...res, roles: { isAdmin: true, isWorker: false } };
  admin.token = jwt.encode(admin, process.env.AUTH_SECRET);
});

test("Test #1 - List role by user id", () => {
  return request(app)
    .get(`${PREFIX_ROUTE}/1/${MAIN_ROUTE}`)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
      expect(typeof res.body.isAdmin).toBe("boolean");
      expect(typeof res.body.isWorker).toBe("boolean");
    });
});

test("Test #2 - List all admins", () => {
  return request(app)
    .get(`${PREFIX_ROUTE}/${MAIN_ROUTE}/admins`)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
      if (res.body.length > 0) expect(res.body[0].isAdmin).toBe(true);
    });
});

test("Test #3 - List all workers", () => {
  return request(app)
    .get(`${PREFIX_ROUTE}/${MAIN_ROUTE}/workers`)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
      if (res.body.length > 0) expect(res.body[0].isWorker).toBe(true);
    });
});

test("Test #4 - Update role", () => {
  return request(app)
    .put(`${PREFIX_ROUTE}/1/${MAIN_ROUTE}`)
    .send({
      isAdmin: true,
      isWorker: true,
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("role updated");
      expect(res.body.data.isAdmin).toBe(true);
    });
});
