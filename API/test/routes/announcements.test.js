/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../../src/app");

const MAIN_ROUTE = "/announcements";

beforeEach(async () => {
  // Clear the announcements table and insert a sample announcement
  await app.db("announcements").truncate();
  await app.db("announcements").insert({
    id_administrator: 1,
    description: "Sample Announcement",
    image: "sample.jpg",
    date: "2025-04-06",
  });
});

test("Teste #1 - Listar os comunicados", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test("Teste #2 - Criar comunicado", async () => {
  const uniqueEmail = `admin${Date.now()}@ipca.pt`; // Gera um e-mail único

  // Insira um administrador válido no banco de dados antes de criar o comunicado
  const admin = await app.db("users").insert(
    {
      name: "Admin",
      phone: "912345678",
      email: uniqueEmail, // Use o e-mail único
      password: "password",
    },
    ["id"]
  );

  const announcementAux = {
    id_administrator: admin[0].id, // Use o ID do administrador criado
    description: "Novo Comunicado",
    image: "new_image.jpg",
    date: "2025-04-06",
  };

  return request(app)
    .post(MAIN_ROUTE)
    .send(announcementAux)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.description).toBe("Novo Comunicado");
    });
});

test("Teste #3 - Atualizar comunicado", () => {
  return app
    .db("announcements")
    .insert(
      {
        id_administrator: 1,
        description: "Comunicado Antigo",
        image: "imagem_antiga.jpg",
        date: "2025-04-05",
      },
      ["id"]
    )
    .then((announcement) =>
      request(app).put(`${MAIN_ROUTE}/${announcement[0].id}`).send({
        description: "Comunicado Atualizado",
        image: "imagem_atualizada.jpg",
        date: "2025-04-06",
      })
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.data.description).toBe("Comunicado Atualizado");
    });
});

test("Teste #4 - Remover comunicado", () => {
  return app
    .db("announcements")
    .insert(
      {
        id_administrator: 1,
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

test("Teste #8 - Deve retornar a lista vazia quando não há comunicados", () => {
  return app
    .db("announcements")
    .truncate() // Limpa a tabela
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
        id_administrator: 1,
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

test("Teste #10 - Não deve criar comunicado com data inválida", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      id_administrator: 1,
      description: "Comunicado com Data Inválida",
      image: "imagem.jpg",
      date: "data-invalida",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Formato de data inválido.");
    });
});

test("Teste #11 - Não deve criar comunicado sem permissão", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      id_administrator: null, // Simula um usuário sem permissão
      description: "Comunicado Sem Permissão",
      image: "imagem.jpg",
      date: "2025-04-06",
    })
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("Utilizador não autorizado.");
    });
});
