/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../../src/app");

const MAIN_ROUTE = "/users";
const mail = `${Date.now()}@ipca.pt`;

test("Teste #1 - Listar os utilizador", () => {
  return request(app)
    .get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test("Teste #2 - Inserir utilizador", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "João Silva",
      phone: "912345678",
      email: mail,
      password: "pasword",
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("João Silva");
    });
});

test("Teste #3 - Inserir utilizador sem nome", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      phone: "912345678",
      email: mail,
      password: "pasword",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O nome é um atributo obrigatório");
    });
});

test("Teste #4 - Inserir utilizador sem email", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "João Silva",
      phone: "912345678",
      password: "pasword",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O email é um atributo obrigatório");
    });
});

test("Teste #5 - Inserir utilizador sem password", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "João Silva",
      phone: "912345678",
      email: mail,
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("A password é um atributo obrigatório");
    });
});

test("Teste #6 - Inserir utilizador sem telefone", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "João Silva",
      email: mail,
      password: "pasword",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O telefone é um atributo obrigatório");
    });
});

test("Teste #7 - Inserir utilizador com email duplicado", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({
      name: "João Silva",
      phone: "912345678",
      email: mail,
      password: "pasword",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email duplicado");
    });
});

test("Teste #8 - Listar os utilizador por id", () => {
  return request(app)
    .get(`${MAIN_ROUTE}/1`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("André Pereira");
      expect(res.body.id).toBe(1);
    });
});

test("Teste #9 - Atualizar utilizador", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: "André Pereira",
      phone: "912912345",
      email: `ap${mail}`,
      password: "updated",
    })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Utilizador atualizado");
      expect(res.body.data.name).toBe("André Pereira");
    });
});

test("Teste #10 - Atualizar utilizador com nome vazio", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: null,
      phone: "912912345",
      email: `ap1${mail}`,
      password: "updated",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O nome é um atributo obrigatório");
    });
});

test("Teste #11 - Atualizar utilizador com telefone vazio", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: "André Pereira",
      phone: null,
      email: `ap1${mail}`,
      password: "updated",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O telefone é um atributo obrigatório");
    });
});

test("Teste #12 - Atualizar utilizador com email vazio", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: "André Pereira",
      phone: "912912345",
      email: null,
      password: "updated",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O email é um atributo obrigatório");
    });
});

test("Teste #13 - Atualizar utilizador com email duplicado", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: "André Pereira",
      phone: "912912345",
      email: `ap${mail}`,
      password: "updated",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email duplicado");
    });
});

test("Teste #14 - Atualizar utilizador com password vazia", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/1`)
    .send({
      name: "André Pereira",
      phone: "912912345",
      email: `ap1${mail}`,
      password: null,
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("A password é um atributo obrigatório");
    });
});

test("Teste #15 - Atualizar utilizador com id inválido", () => {
  return request(app)
    .put(`${MAIN_ROUTE}/-1`)
    .send({
      name: "André Pereira",
      phone: "912912345",
      email: `ap1${mail}`,
      password: "updated",
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Utilizador não encontrado");
    });
});

test("Teste #16 - Remover utilizador", () => {
  return app
    .db("users")
    .insert(
      {
        name: "João Silva",
        phone: "912345678",
        email: `del${mail}`,
        password: "password",
      },
      ["id"]
    )
    .then((user) => request(app).delete(`${MAIN_ROUTE}/${user[0].id}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});


test("Teste #17 - Remover utilizador com id inválido", () => {
  return request(app)
    .delete(`${MAIN_ROUTE}/-1`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Utilizador não encontrado");
    });
});