/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const MAIN_ROUTE = "/requests";
var requests;
var report;
var user;
var admin;

beforeAll(async () => {
  const res = await app.services.user.findOne({ id: 1 });

  user = { ...res, roles: { isAdmin: false, isWorker: false } };
  user.token = jwt.encode(user, process.env.AUTH_SECRET);

  admin = { ...res, roles: { isAdmin: true, isWorker: false } };
  admin.token = jwt.encode(admin, process.env.AUTH_SECRET);

  requests = await app.services.request.save({
    user_id: 1,
    description: "Test request",
  });

  report = await app.services.request.save({
    user_id: 1,
    description: "Test request",
    is_report: true,
  });
});

test("Test #1 - List all requests", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

test("Test #2 - List request by id", () => {
  return request(app)
    .get(`${MAIN_ROUTE}/${requests.id}`)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(requests.id);
    });
});

test("Test #3 - Insert request", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      user_id: 1,
      description: "Test request",
    })
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("PENDING");
    });
});

test("Test #4 - Insert report request", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      user_id: 1,
      description: "Test report request",
      is_report: true,
    })
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("PENDING");
    });
});

test("Test #5 - Update request", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/${requests.id}`)
    .send({
      admin_id: 1,
      response: "Test response",
      accepted: true,
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Request updated");
      expect(res.body.data.status).toBe("APPROVED");
    });
});

test("Test #6 - Update report request", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/${report.id}`)
    .send({
      admin_id: 1,
      response: "Test response",
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Request updated");
      expect(res.body.data.status).toBe("CLOSED");
    });
});
