/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const MAIN_ROUTE = "/warnings";
const date = new Date();
const dateString = `${String(date.getDate()).padStart(2, "0")}/${String(
  date.getMonth() + 1
).padStart(2, "0")}/${date.getFullYear()}`;
var warning;
var user;
var admin;

beforeEach(async () => {
  const res = await app.services.user.findOne({ id: 1 });

  user = { ...res, roles: { isAdmin: false, isWorker: false } };
  user.token = jwt.encode(user, process.env.AUTH_SECRET);

  admin = { ...res, roles: { isAdmin: true, isWorker: false } };
  admin.token = jwt.encode(admin, process.env.AUTH_SECRET);

  warning = await app.services.warning.save({
    admin_id: 1,
    resident_id: 1,
    description: "Test warning",
    date: dateString,
  });
});

test("Test #1 - List all warnings", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

test("Test #2 - List warning by id", () => {
  return request(app)
    .get(`${MAIN_ROUTE}/1`)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });
});

test("Test #3 - Insert warning", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .set("Authorization", `Bearer ${admin.token}`)
    .send({
      admin_id: 1,
      resident_id: 1,
      description: "Test warning",
      date: dateString,
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.description).toBe("Test warning");
    });
});

test("Test #4 - Update warning", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .set("Authorization", `Bearer ${admin.token}`)
    .send({
      description: "Test warning updated",
      date: dateString,
    })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Warning updated");
      expect(res.body.data.description).toBe("Test warning updated");
    });
});

test("Test #5 - Delete warning with invalid id", () => {
  return request(app)
    .delete(`${MAIN_ROUTE}/-1`)
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Warning not found");
    });
});

test("Test #6 - Delete warning", () => {
  return request(app)
    .delete(`${MAIN_ROUTE}/${warning.id}`)
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
