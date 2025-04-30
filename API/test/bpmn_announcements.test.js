/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../src/app");

const MAIN_ROUTE = "/announcements";
var announcement;
var user;
var admin;

beforeAll(async () => {
  const adminRes = await app.services.user.findOne({ id: 1 });
  const userRes = await app.services.user.findOne({ id: 2 });

  user = { ...userRes, roles: { isAdmin: false, isWorker: false } };
  user.token = jwt.encode(user, process.env.AUTH_SECRET);

  admin = { ...adminRes, roles: { isAdmin: true, isWorker: false } };
  admin.token = jwt.encode(admin, process.env.AUTH_SECRET);
});

describe("Announcements BPMN workflow - Success (Approve)", () => {
  test("Test #1 - Create a new announcement", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        admin_id: admin.id,
        description: "BPMN announcement",
        image: "sample.jpg",
        date: "2025-04-06",
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.description).toBe("BPMN announcement");
        announcement = res.body;
      });
  });

  test("Test #2 - List announcement", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${announcement.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(announcement.id);
      });
  });
});

describe("Announcements BPMN workflow - Fail (Invalid announcement)", () => {
  test("Test #1 - Create a new announcement (no date)", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        admin_id: admin.id,
        description: "BPMN announcement",
        image: "sample.jpg",
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("A data é obrigatória");
      });
  });

  test("Test #2 - Create a new announcement (no description)", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        admin_id: admin.id,
        image: "sample.jpg",
        date: "2025-04-06",
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("A descrição é obrigatória");
      });
  });

  test("Test #3 - Create a new announcement (invalid role)", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        admin_id: admin.id,
        description: "BPMN announcement",
        image: "sample.jpg",
        date: "2025-04-06",
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {        
        expect(res.status).toBe(403);
        expect(res.body.error).toBe("Action not permitted");
      });
  });
});

