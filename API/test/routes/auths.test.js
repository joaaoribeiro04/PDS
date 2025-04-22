/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const mail = `auth${Date.now()}@ipca.pt`;
var admin;

beforeAll(async () => {
  admin = await app.services.user.save({
    name: "Jorge Andrade",
    phone: "912345678",
    email: `${mail}`,
    password: "1234",
  });

  admin = {
    ...admin,
    password: "1234",
    roles: { isAdmin: true, isWorker: false },
  };
  admin.token = jwt.encode(admin, process.env.AUTH_SECRET);
});

test("Test #1 - Get auth token", () => {
  return request(app)
    .post("/auth/signin")
    .send({
      email: admin.email,
      password: admin.password,
    })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
});

test("Test #2 - Authenticate with wrong password", () => {
  return request(app)
    .post("/auth/signin")
    .send({
      email: admin.email,
      password: "123",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Authentication failed.");
    });
});

test("Test #3 - Authenticate with invalid user", () => {
  return request(app)
    .post("/auth/signin")
    .send({
      email: `f${mail}`,
      password: "123456",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Authentication failed.");
    });
});

test("Test #4 - Access protected routes", () => {
  return request(app)
    .get("/users")
    .then((res) => {
      expect(res.status).toBe(401);
    });
});

test("Test #5 - Access role based protected routes with real time revoged role", () => {
  return request(app)
    .put("/users/1/roles")
    .send({
      isAdmin: true,
      isWorker: true,
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("Action not permitted");
    });
});

// afterAll(async () => {
//   await app.services.user.remove(admin.id);
// });
