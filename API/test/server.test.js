// eslint-disable-next-line no-undef
const supertest = require("supertest");

const request = supertest("http://localhost:3001");

test.skip("Validar se o servidor responde na porta 3001", async () => {
  return request.get("/").then((res) => {
    expect(res.status).toBe(200);
  });
});
