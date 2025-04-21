/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const MAIN_ROUTE = "/users";
const mail = `${Date.now()}@ipca.pt`;
var user;
var admin;

beforeAll(async () => {
  const res = await app.services.user.save({
    name: "Jorge Andrade",
    phone: "912345678",
    email: `andre${mail}`,
    password: "1234",
  });

  const resAdmin = await app.services.user.findOne({ id: 1 });

  user = { ...res, roles: { isAdmin: false, isWorker: false } };
  user.token = jwt.encode(user, process.env.AUTH_SECRET);

  admin = { ...resAdmin, roles: { isAdmin: true, isWorker: false } };
  admin.token = jwt.encode(admin, process.env.AUTH_SECRET);
});

test("Test #1 - Get all users", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).not.toHaveProperty("password");
    });
});

test("Test #2 - Insert user", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "João Silva",
      phone: "912345678",
      email: mail,
      password: "pasword",
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("João Silva");
      expect(res.body).not.toHaveProperty("password");
    });
});

test("Test #2.1 - Save encrypted password", async () => {
  return await request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "João Silva",
      phone: "912345678",
      email: `new${mail}`,
      password: "1234",
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then(async (res) => {
      expect(res.status).toBe(201);

      const { id } = res.body;
      const userDB = await app.services.user.findOne({ id });

      expect(userDB.password).not.toBeUndefined();
      expect(userDB.password).not.toBe("1234");
    });
});

test("Test #3 - Insert user without name", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      phone: "912345678",
      email: mail,
      password: "pasword",
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Name is a required attribute");
    });
});

test("Test #4 - Insert user without email", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "João Silva",
      phone: "912345678",
      password: "pasword",
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email is a required attribute");
    });
});

test("Test #5 - Insert user without password", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "João Silva",
      phone: "912345678",
      email: mail,
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Password is a required attribute");
    });
});

test("Test #6 - Insert user without phone", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "João Silva",
      email: mail,
      password: "pasword",
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Phone is a required attribute");
    });
});

test("Test #7 - Insert user with duplicated email", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "João Silva",
      phone: "912345678",
      email: mail,
      password: "pasword",
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email is already in use");
    });
});

test("Test #8 - Get user by id", () => {
  return request(app)
    .get(`${MAIN_ROUTE}/1`)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("André Pereira");
      expect(res.body.id).toBe(1);
    });
});

test("Test #9 - Update user", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: "André Pereira",
      phone: "912912345",
      email: `ap${mail}`,
      password: "updated",
    })
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User updated");
      expect(res.body.data.name).toBe("André Pereira");
    });
});

test("Test #10 - Update user with name null", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: null,
      phone: "912912345",
      email: `ap1${mail}`,
      password: "updated",
    })
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Name is a required attribute");
    });
});

test("Test #11 - Update user with phone null", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: "André Pereira",
      phone: null,
      email: `ap1${mail}`,
      password: "updated",
    })
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Phone is a required attribute");
    });
});

test("Test #12 - Update user with email null", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: "André Pereira",
      phone: "912912345",
      email: null,
      password: "updated",
    })
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email is a required attribute");
    });
});

test("Test #13 - Update user with duplicated email", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: "André Pereira",
      phone: "912912345",
      email: `ap${mail}`,
      password: "updated",
    })
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email is already in use");
    });
});

test("Test #14 - Update user with password null", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: "André Pereira",
      phone: "912912345",
      email: `ap1${mail}`,
      password: null,
    })
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Password is a required attribute");
    });
});

test("Test #15 - Update user with invalid id", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/-1`)
    .send({
      name: "André Pereira",
      phone: "912912345",
      email: `ap1${mail}`,
      password: "updated",
    })
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("User not found");
    });
});

test("Test #16 - Delete user with invalid id", () => {
  return request(app)
    .delete(`${MAIN_ROUTE}/-1`)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("User not found");
    });
});

test("Test #17 - Delete user", () => {
  return request(app)
    .delete(`${MAIN_ROUTE}/${user.id}`)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
