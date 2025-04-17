// const request = require("supertest");
// const app = require("../../src/app");

// const MAIN_ROUTE = "/faturas";

// describe("Testes de rotas de Faturas", () => {
//   beforeEach(async () => {
//     await app.db("faturas").truncate();
//   });

//   test("Deve listar todas as faturas", () => {
//     return request(app)
//       .get(MAIN_ROUTE)
//       .then((res) => {
//         expect(res.status).toBe(200);
//       });
//   });

//   test("Deve criar uma fatura", async () => {
//     const fatura = {
//       id_residente: 1,
//       id_gastos: 1,
//       total: 150,
//       data_emissao: "2025-04-07",
//       data_limite: "2025-04-30",
//       status: "pendente"
//     };
//     return request(app)
//       .post(MAIN_ROUTE)
//       .send(fatura)
//       .then((res) => {
//         expect(res.status).toBe(201);
//         expect(res.body.total).toBe(150);
//       });
//   });

//   test("Não deve criar fatura com data inválida", () => {
//     return request(app)
//       .post(MAIN_ROUTE)
//       .send({
//         id_residente: 1,
//         id_gastos: 1,
//         total: 100,
//         data_emissao: "data-invalida",
//         data_limite: "2025-04-30",
//         status: "pendente"
//       })
//       .then((res) => {
//         expect(res.status).toBe(400);
//         expect(res.body.error).toBe("Data de emissão inválida ou ausente");
//       });
//   });

//   test("Deve atualizar uma fatura existente", async () => {
//     const inserted = await app.db("faturas").insert({
//       id_residente: 1,
//       id_gastos: 1,
//       total: 200,
//       data_emissao: "2025-04-01",
//       data_limite: "2025-04-30",
//       status: "pendente"
//     }, ["id"]);

//     return request(app)
//       .put(`${MAIN_ROUTE}/${inserted[0].id}`)
//       .send({ total: 300, data_emissao: "2025-04-01" })
//       .then((res) => {
//         expect(res.status).toBe(200);
//         expect(res.body.data.total).toBe(300);
//       });
//   });

//   test("Deve remover uma fatura existente", async () => {
//     const inserted = await app.db("faturas").insert({
//       id_residente: 1,
//       id_gastos: 1,
//       total: 200,
//       data_emissao: "2025-04-01",
//       data_limite: "2025-04-30",
//       status: "pendente"
//     }, ["id"]);

//     return request(app)
//       .delete(`${MAIN_ROUTE}/${inserted[0].id}`)
//       .then((res) => {
//         expect(res.status).toBe(204);
//       });
//   });
// });