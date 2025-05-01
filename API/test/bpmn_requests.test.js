/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../src/app");

const MAIN_ROUTE = "/requests";
var requests;
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

describe("Requests BPMN workflow - Success (Approve)", () => {
  test("Test #1 - Create a new request", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: 1,
        description: "BPMN request",
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("PENDING");
        requests = res.body;
      });
  });

  test("Test #2 - List user request", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${requests.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(requests.id);
      });
  });

  test("Test #3 - Approve request", () => {
    return request(app)
      .put(`${MAIN_ROUTE}/${requests.id}`)
      .send({
        admin_id: 1,
        response: "BPMN test response",
        accepted: true,
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Request updated");
        expect(res.body.data.status).toBe("APPROVED");
      });
  });

  test("Test #4 - List user request", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${requests.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(requests.id);
        expect(res.body.status).toBe("APPROVED");
        expect(res.body.response).toBe("BPMN test response");
      });
  });
});

describe("Requests BPMN workflow - Success (Reject)", () => {
  test("Test #1 - Create a new request", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: 1,
        description: "BPMN request",
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("PENDING");
        requests = res.body;
      });
  });

  test("Test #2 - List user request", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${requests.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(requests.id);
      });
  });

  test("Test #3 - Approve request", () => {
    return request(app)
      .put(`${MAIN_ROUTE}/${requests.id}`)
      .send({
        admin_id: 1,
        response: "BPMN test response",
        accepted: false,
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Request updated");
        expect(res.body.data.status).toBe("DENIED");
      });
  });

  test("Test #4 - List user request", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${requests.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(requests.id);
        expect(res.body.status).toBe("DENIED");
        expect(res.body.response).toBe("BPMN test response");
      });
  });
});

describe("Requests BPMN workflow - Fail (Invalid request)", () => {
  test("Test #1 - Create a new request", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: 1,
        description: "",
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.status).toBe(undefined);
      });
  });

  test("Test #2 - Create a new request", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: -1,
        description: "Test request",
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.status).toBe(undefined);
        expect(res.body.id).toBe(undefined);
      });
  });
});

describe("Requests BPMN workflow - Fail (Invalid request id)", () => {
  test("Test #1 - Create a new request", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: 1,
        description: "BPMN request",
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("PENDING");
        requests = res.body;
      });
  });

  test("Test #2 - List user request", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/-1`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(undefined);
      });
  });
});

describe("Requests BPMN workflow - Fail (Invalid request update)", () => {
  test("Test #1 - Create a new request", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: 1,
        description: "BPMN request",
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("PENDING");
        requests = res.body;
      });
  });

  test("Test #2 - List user request", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${requests.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(requests.id);
      });
  });

  test("Test #3 - Invalid Updated request", () => {
    return request(app)
      .put(`${MAIN_ROUTE}/${requests.id}`)
      .send({
        admin_id: 1,
        response: "BPMN test response",
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(undefined);
      });
  });

  test("Test #4 - Invalid update request", () => {
    return request(app)
      .put(`${MAIN_ROUTE}/${requests.id}`)
      .send({
        admin_id: -1,
        response: "BPMN test response",
        accepted: true,
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });

  test("Test #5 - Invalid role to update request", () => {
    return request(app)
      .put(`${MAIN_ROUTE}/${requests.id}`)
      .send({
        admin_id: 1,
        response: "BPMN test response",
        accepted: true,
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toBe(undefined);
      });
  });
});
