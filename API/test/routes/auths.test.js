/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../../src/app");

const mail = `auth${Date.now()}@ipca.pt`;

test("Test #1 - Get auth token", () => {
  return app.services.user
    .save({
      name: "Teste",
      email: mail,
      password: "123456",
      phone: "912345678",
    })
    .then(() => {
      return request(app)
        .post("/auth/signin")
        .send({
          email: mail,
          password: "123456",
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("token");
        });
    });
});

test("Test #2 - Authenticate with wrong password", () => {
  return app.services.user
    .save({
      name: "Teste",
      email: `new${mail}`,
      password: "123456",
      phone: "912345678",
    })
    .then(() => {
      return request(app)
        .post("/auth/signin")
        .send({
          email: `new${mail}`,
          password: "123",
        })
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.error).toBe("Authentication failed.");
        });
    });
});

test("Test #3 - Authenticate with invalid user", () => {
  return app.services.user
    .save({
      name: "Teste",
      email: `s${mail}`,
      password: "123456",
      phone: "912345678",
    })
    .then(() => {
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
});

test("Test #4 - Access protected routes", () => {
  return request(app)
    .get("/users")
    .then((res) => {
      expect(res.status).toBe(401);
    });
});