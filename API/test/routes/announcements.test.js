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

  // Clear the announcements table and insert a sample announcement
  await app.db("announcements").truncate();
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
      request(app).delete(`${MAIN_ROUTE}/${announcement[0].id}`)
    )
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

/*
test("Teste #5 - Não deve criar comunicado sem campos obrigatórios", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({})
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        "Os campos obrigatórios não foram preenchidos."
      );
    });
});
*/

/*
test("Teste #6 - Não deve atualizar comunicado inexistente", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/9999`)
    .send({
      description: "Comunicado Inexistente",
      image: "imagem.jpg",
      date: "2025-04-06",
    })
    .then((res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Comunicado não encontrado.");
    });
});
*/

/*
test("Teste #7 - Não deve remover comunicado inexistente", () => {
  return request(app)
    .delete(`${MAIN_ROUTE}/9999`)
    .then((res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Comunicado não encontrado.");
    });
});
*/

test("Test #8 - List empty announcements", () => {
  return app
    .db("announcements")
    .truncate()
    .then(() =>
      request(app)
        .get(MAIN_ROUTE)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(0);
        })
    );
});

/*
test("Teste #9 - Deve atualizar parcialmente um comunicado", () => {
  return app
    .db("announcements")
    .insert(
      {
        admin_id: 1,
        description: "Comunicado Parcial",
        image: "imagem.jpg",
        date: "2025-04-05",
      },
      ["id"]
    )
    .then((announcement) =>
      request(app).put(`${MAIN_ROUTE}/${announcement[0].id}`).send({
        description: "Descrição Atualizada",
      })
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.data.description).toBe("Descrição Atualizada");
      expect(res.body.data.image).toBe("imagem.jpg"); // Campo não alterado
    });
});
*/

test("Test #10 - Invalid date format", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      admin_id: 1,
      description: "Comunicado com Data Inválida",
      image: "imagem.jpg",
      date: "data-invalida",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Formato de data inválido.");
    });
});
