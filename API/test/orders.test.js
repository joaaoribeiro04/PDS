const request = require('supertest');
const app = require('../src/app');

describe('Orders', () => {
  it('should create a new order', async () => {
    const res = await request(app)
      .post('/orders')
      .send({
        client_name: 'Teste',
        address: 'Rua de Testes'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should return a list of orders', async () => {
    const res = await request(app).get('/orders');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});