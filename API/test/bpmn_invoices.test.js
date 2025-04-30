/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../src/app");

const MAIN_ROUTE = "/invoices";
const MAIN_ROUTE_WARNING = "/warnings";
const date = new Date();
var invoice;
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

describe("Invoices BPMN workflow - Success (Paid)", () => {
  test("Test #1 - Create a new invoice", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: user.id,
        isPaid: false,
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.user_id).toBe(user.id);
        invoice = res.body;
      });
  });

  test("Test #2 - List invoice by id", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${invoice.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(invoice.id);
      });
  });

  //   invoice is paid

  test("Test #3 - Update invoice", () => {
    return request(app)
      .put(`${MAIN_ROUTE}/${invoice.id}`)
      .send({
        isPaid: true,
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.data.isPaid).toBe(true);
      });
  });
});

describe("Invoices BPMN workflow - Success (not paid after due date)", () => {
  test("Test #1 - Create a new invoice", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: user.id,
        isPaid: false,
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.user_id).toBe(user.id);
        invoice = res.body;
      });
  });

  test("Test #2 - List invoice by id", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${invoice.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(invoice.id);
      });
  });

  //   invoice is not paid after due date

  test("Test #3 - List invoice by id", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${invoice.id}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(invoice.id);
      });
  });

  test("Test #4 - Give warning to reported user", () => {
    return request(app)
      .post(MAIN_ROUTE_WARNING)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({
        admin_id: admin.id,
        resident_id: user.id,
        description: "Invoice payment is due",
        date: date.toLocaleDateString(),
      })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.description).toBe("Invoice payment is due");
      });
  });
});

describe("Invoices BPMN workflow - Fail (Invalid invoice)", () => {
  test("Test #1 - Create a new invoice without user_id", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        isPaid: false,
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("User ID is a required attribute");
      });
  });

  test("Test #2 - Create a new invoice with invalid role", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: user.id,
        isPaid: false,
      })
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe("Action not permitted");
      });
  });
});

describe("Invoices BPMN workflow - Fail (Invalid warning)", () => {
  test("Test #1 - Create a new invoice", () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({
        user_id: user.id,
        isPaid: false,
      })
      .set("Authorization", `Bearer ${admin.token}`)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.user_id).toBe(user.id);
        invoice = res.body;
      });
  });

  test("Test #2 - List invoice by id", () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${invoice.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(invoice.id);
      });
  });

  test("Test #3 - Give warning to reported user without admin id", () => {
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

  test("Test #4 - Give warning to reported user without resident id", () => {
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

  test("Test #5 - Give warning to reported user without description", () => {
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

  test("Test #6 - Give warning to reported user without date", () => {
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

  test("Test #7 - Give warning to reported user with invalid role", () => {
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
