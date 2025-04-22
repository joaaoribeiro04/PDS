/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../src/app");

test.skip("Testar se está a resolver na raiz", () => {
    return request(app).get("/").then((res) => {
        expect(res.status).toBe(200);
    });
});
