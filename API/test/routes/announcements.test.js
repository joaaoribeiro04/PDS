/* eslint-disable no-undef */
const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const MAIN_ROUTE = "/announcements";
var user;
var admin;

beforeEach(async () => {
  const res = await app.services.user.findOne({ id: 1 });

  user = { ...res, roles: { isAdmin: false, isWorker: false } };
  user.token = jwt.encode(user, process.env.AUTH_SECRET);

  admin = { ...res, roles: { isAdmin: true, isWorker: false } };
  admin.token = jwt.encode(admin, process.env.AUTH_SECRET);

  await app.db("announcements").insert({
    admin_id: 1,
    description: "Sample Announcement",
    image: "sample.jpg",
    date: "2025-04-06",
  });
});

test("Test #1 - List announcements", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .set("Authorization", `Bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test("Test #2 - Insert announcements", async () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      admin_id: admin.id,
      description: "Novo Comunicado",
      image: "new_image.jpg",
      date: "2025-04-06",
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.description).toBe("Novo Comunicado");
    });
});

test("Test #3 - Update announcement", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      description: "Comunicado Atualizado",
      image: "imagem_atualizada.jpg",
      date: "2025-04-06",
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.data.description).toBe("Comunicado Atualizado");
    });
});

test("Test #4 - Remove announcement", () => {
  return app
    .db("announcements")
    .insert(
      {
        admin_id: 1,
        description: "Comunicado a Remover",
        image: "imagem.jpg",
        date: "2025-04-06",
      },
      ["id"]
    )
    .then((announcement) =>
      request(app)
        .delete(`${MAIN_ROUTE}/${announcement[0].id}`)
        .set("Authorization", `Bearer ${admin.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test("Test #8 - List empty announcements", () => {
  return app
    .db("announcements")
    .truncate()
    .then(() =>
      request(app)
        .get(MAIN_ROUTE)
        .set("Authorization", `Bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(0);
        })
    );
});

test("Test #10 - Invalid date format", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      admin_id: 1,
      description: "Comunicado com Data Inválida",
      image: "imagem.jpg",
      date: "data-invalida",
    })
    .set("Authorization", `Bearer ${admin.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Formato de data inválido.");
    });
});
