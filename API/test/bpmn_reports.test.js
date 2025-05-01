/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../src/app");

const MAIN_ROUTE = "/requests";
const MAIN_ROUTE_WARNING = "/warnings";
const date = new Date();
var report;
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

describe("Reports BPMN workflow - Success (Approve)", () => {
  test("Test #1 - Create a new report", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: user.id,
        description: "BPMN test report request",
        is_report: true,
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("PENDING");
        report = res.body;
      });
  });

  test("Test #2 - List user report", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${report.id}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(report.id);
      });
  });

  test("Test #3 - Approve report", () => {
    return request(app)
      .put(`${MAIN_ROUTE}/${report.id}`)
      .send({
        admin_id: admin.id,
        response: "BPMN test report response was accepted",
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Request updated");
        expect(res.body.data.response).toBe(
          "BPMN test report response was accepted"
        );
      });
  });

  test("Test #4 - Give warning to reported user", () => {
    return request(app)
      .post(MAIN_ROUTE_WARNING)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({
        admin_id: admin.id,
        resident_id: user.id,
        description: "BPMN warning",
        date: date.toLocaleDateString(),
      })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.description).toBe("BPMN warning");
      });
  });
});

describe("Reports BPMN workflow - Success (Deny)", () => {
  test("Test #1 - Create a new report", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: user.id,
        description: "BPMN test report request",
        is_report: true,
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("PENDING");
        report = res.body;
      });
  });

  test("Test #2 - List user report", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${report.id}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(report.id);
      });
  });

  test("Test #3 - Deny report", () => {
    return request(app)
      .put(`${MAIN_ROUTE}/${report.id}`)
      .send({
        admin_id: admin.id,
        response: "BPMN test report response was denied",
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Request updated");
        expect(res.body.data.response).toBe(
          "BPMN test report response was denied"
        );
      });
  });
});

describe("Reports BPMN workflow - Fail (Invalid report)", () => {
  test("Test #1 - Create a new report without description", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: user.id,
        is_report: true,
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Description is a required attribute");
      });
  });

  test("Test #2 - Create a new report without user ID", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        description: "BPMN test report request",
        is_report: true,
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("User ID is a required attribute");
      });
  });

  test("Test #3 - Create a new report with invalid user ID", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: -1,
        description: "BPMN test report request",
        is_report: true,
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Error saving request");
      });
  });
});

describe("Reports BPMN workflow - Fail (Invalid update)", () => {
  test("Test #1 - Create a new report", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: user.id,
        description: "BPMN test report request",
        is_report: true,
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("PENDING");
        report = res.body;
      });
  });

  test("Test #2 - List user report", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${report.id}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(report.id);
      });
  });

  test("Test #3 - Update report with invalid role", () => {
    return request(app)
      .put(`${MAIN_ROUTE}/${report.id}`)
      .send({
        admin_id: admin.id,
        response: "BPMN test report response was accepted",
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe("Action not permitted");
      });
  });
});

describe("Reports BPMN workflow - Fail (Invalid warning)", () => {
  test("Test #1 - Create a new report", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: user.id,
        description: "BPMN test report request",
        is_report: true,
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("PENDING");
        report = res.body;
      });
  });

  test("Test #2 - List user report", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${report.id}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(report.id);
      });
  });

  test("Test #3 - Approve report", () => {
    return request(app)
      .put(`${MAIN_ROUTE}/${report.id}`)
      .send({
        admin_id: admin.id,
        response: "BPMN test report response was accepted",
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Request updated");
        expect(res.body.data.response).toBe(
          "BPMN test report response was accepted"
        );
      });
  });

  test("Test #4 - Give warning to reported user without admin id", () => {
    return request(app)
      .post(MAIN_ROUTE_WARNING)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({
        resident_id: user.id,
        description: "BPMN warning",
        date: date.toLocaleDateString(),
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Admin ID is a required attribute");
      });
  });

  test("Test #5 - Give warning to reported user without resident id", () => {
    return request(app)
      .post(MAIN_ROUTE_WARNING)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({
        admin_id: admin.id,
        description: "BPMN warning",
        date: date.toLocaleDateString(),
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Resident ID is a required attribute");
      });
  });

  test("Test #6 - Give warning to reported user without description", () => {
    return request(app)
      .post(MAIN_ROUTE_WARNING)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({
        admin_id: admin.id,
        resident_id: user.id,
        date: date.toLocaleDateString(),
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Description is a required attribute");
      });
  });

  test("Test #7 - Give warning to reported user without date", () => {
    return request(app)
      .post(MAIN_ROUTE_WARNING)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({
        admin_id: admin.id,
        resident_id: user.id,
        description: "BPMN warning",
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Date is a required attribute");
      });
  });

  test("Test #4 - Give warning to reported user with invalid role", () => {
    return request(app)
      .post(MAIN_ROUTE_WARNING)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        admin_id: admin.id,
        resident_id: user.id,
        description: "BPMN warning",
        date: date.toLocaleDateString(),
      })
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe("Action not permitted");
      });
  });
});
