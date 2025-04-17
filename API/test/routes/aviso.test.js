// /* eslint-disable no-undef */
// const request = require("supertest");
// const app = require("../../src/app");

// const MAIN_ROUTE = "/avisos";

// beforeEach(async () => {
//   await app.db("aviso").truncate();
//   await app.db("aviso").insert({
//     id_administrator: 1,
//     description: "Aviso inicial",
//     image: "aviso.jpg",
//     date: "2025-04-06",
//   });
// });

// test("Deve listar os avisos", () => {
//   return request(app)
//     .get(MAIN_ROUTE)
//     .then((res) => {
//       expect(res.status).toBe(200);
//       expect(res.body.length).toBeGreaterThan(0);
//     });
// });

// test("Deve criar aviso", async () => {
//   const admin = await app.db("users").insert(
//     {
//       name: "Administrador",
//       phone: "912345678",
//       email: `admin${Date.now()}@ipca.pt`,
//       password: "password",
//     },
//     ["id"]
//   );

//   const aviso = {
//     id_administrator: admin[0].id,
//     description: "Novo aviso",
//     image: "imagem_nova.jpg",
//     date: "2025-04-07",
//   };

//   return request(app)
//     .post(MAIN_ROUTE)
//     .send(aviso)
//     .then((res) => {
//       expect(res.status).toBe(201);
//       expect(res.body.description).toBe("Novo aviso");
//     });
// });

// test("Deve atualizar um aviso", () => {
//   return app
//     .db("aviso")
//     .insert(
//       {
//         id_administrator: 1,
//         description: "Aviso antigo",
//         image: "imagem_antiga.jpg",
//         date: "2025-04-05",
//       },
//       ["id"]
//     )
//     .then((aviso) =>
//       request(app).put(`${MAIN_ROUTE}/${aviso[0].id}`).send({
//         description: "Aviso atualizado",
//         image: "imagem_nova.jpg",
//         date: "2025-04-06",
//       })
//     )
//     .then((res) => {
//       expect(res.status).toBe(200);
//       expect(res.body.data.description).toBe("Aviso atualizado");
//     });
// });

// test("Deve remover um aviso", () => {
//   return app
//     .db("aviso")
//     .insert(
//       {
//         id_administrator: 1,
//         description: "Aviso a remover",
//         image: "imagem.jpg",
//         date: "2025-04-06",
//       },
//       ["id"]
//     )
//     .then((aviso) =>
//       request(app).delete(`${MAIN_ROUTE}/${aviso[0].id}`)
//     )
//     .then((res) => {
//       expect(res.status).toBe(204);
//     });
// });

// test("Deve retornar lista vazia quando não há avisos", () => {
//   return app
//     .db("aviso")
//     .truncate()
//     .then(() =>
//       request(app)
//         .get(MAIN_ROUTE)
//         .then((res) => {
//           expect(res.status).toBe(200);
//           expect(res.body.length).toBe(0);
//         })
//     );
// });

// test("Não deve criar aviso com data inválida", () => {
//   return request(app)
//     .post(MAIN_ROUTE)
//     .send({
//       id_administrator: 1,
//       description: "Aviso inválido",
//       image: "imagem.jpg",
//       date: "data-invalida",
//     })
//     .then((res) => {
//       expect(res.status).toBe(400);
//       expect(res.body.error).toBe("Formato de data inválido.");
//     });
// });

// test("Não deve criar aviso sem permissão", () => {
//   return request(app)
//     .post(MAIN_ROUTE)
//     .send({
//       id_administrator: null,
//       description: "Aviso sem permissão",
//       image: "imagem.jpg",
//       date: "2025-04-06",
//     })
//     .then((res) => {
//       expect(res.status).toBe(403);
//       expect(res.body.error).toBe("Utilizador não autorizado.");
//     });
// });
