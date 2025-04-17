// const request = require('supertest');
// const app = require('../../src/app');

// beforeAll(async () => {
//   // Limpar a tabela antes dos testes
//   await app.db('orders').del();
// });

// describe('CRUD de Encomendas', () => {

//   let orderId;

//   test('Criar uma nova encomenda', async () => {
//     const res = await request(app).post('/orders').send({
//       product: 'Monitor 24"',
//       quantity: 2,
//       client_name: 'Ana Martins',
//     });

//     expect(res.status).toBe(201);
//     expect(res.body).toHaveProperty('id');
//     orderId = res.body.id;
//   });

//   test('Listar encomendas', async () => {
//     const res = await request(app).get('/orders');
//     expect(res.status).toBe(200);
//     expect(res.body.length).toBeGreaterThan(0);
//   });

//   test('Ler uma encomenda pelo ID', async () => {
//     const res = await request(app).get(`/orders/${orderId}`);
//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty('product', 'Monitor 24"');
//   });

//   test('Atualizar uma encomenda', async () => {
//     const res = await request(app).put(`/orders/${orderId}`).send({
//       product: 'Monitor 27"',
//       quantity: 3,
//       client_name: 'Ana M.',
//     });

//     expect(res.status).toBe(200);
//     expect(res.body).toEqual({ success: true });

//     const updated = await request(app).get(`/orders/${orderId}`);
//     expect(updated.body).toHaveProperty('product', 'Monitor 27"');
//   });

//   test('Eliminar uma encomenda', async () => {
//     const res = await request(app).delete(`/orders/${orderId}`);
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual({ success: true });

//     const deleted = await request(app).get(`/orders/${orderId}`);
//     expect(deleted.status).toBe(404);
//   });

//   test('Validar erro ao criar encomenda sem dados', async () => {
//     const res = await request(app).post('/orders').send({});
//     expect(res.status).toBe(400);
//     expect(res.body).toHaveProperty('error');
//   });

// });