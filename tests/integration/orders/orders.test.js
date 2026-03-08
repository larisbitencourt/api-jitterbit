const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../../../src/server');
const Order = require('../../../src/models/Order');
const User = require('../../../src/models/User');
const Product = require('../../../src/models/Product');

describe('Integração: Fluxo de Pedidos (Orders)', () => {
  let token;
  let testProduct;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27018/api-jitterbit-test');
    }

    await User.deleteMany({ email: 'admin-integration@test.com' });
    await Order.deleteMany({});

    testProduct = await Product.findOne({ productId: { $exists: true } }); 
    
    if (!testProduct) {
      throw new Error('Erro: Nenhum produto encontrado.');
    }

    await User.create({
      name: 'Admin Integration',
      email: 'admin-integration@test.com',
      password: 'password123',
      role: 'admin'
    });

    const loginRes = await request(app)
      .post('/login')
      .send({ email: 'admin-integration@test.com', password: 'password123' });

    token = loginRes.body.token;
  });

  it('POST /order/ - Deve criar um pedido', async () => {
    const id = "PEDIDO-INT-001";
    await Order.deleteOne({ orderId: id });

    const res = await request(app)
      .post('/order/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        numeroPedido: id,
        valorTotal: 150.50,
        dataCriacao: new Date(),
        items: [{ idItem: testProduct.productId, quantidadeItem: 1, valorItem: 150.50 }]
      });

    expect(res.status).to.equal(201);
  });

  it('GET /order/:orderId - Deve buscar pelo orderId', async () => {
    const orderRef = "PEDIDO-BUSCA-99";
    await Order.deleteOne({ orderId: orderRef });

    await Order.create({
      orderId: orderRef,
      value: 100,
      creationDate: new Date(),
      items: [{ productId: testProduct.productId, quantity: 1, price: 100 }]
    });

    const res = await request(app)
      .get(`/order/${orderRef}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.orderId).to.equal(orderRef);
  });

  it('PUT /order/:orderId - Deve atualizar o pedido', async () => {
    const orderRef = "PEDIDO-UPDATE-77";
    await Order.deleteOne({ orderId: orderRef });

    await Order.create({
      orderId: orderRef,
      value: 50,
      creationDate: new Date(),
      items: [{ productId: testProduct.productId, quantity: 1, price: 50 }]
    });

    const res = await request(app)
      .put(`/order/${orderRef}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        valorTotal: 500,
        dataCriacao: new Date(),
        items: [{ idItem: testProduct.productId, quantidadeItem: 5, valorItem: 100 }]
      });

    expect(res.status).to.equal(200);
  });

  it('DELETE /order/:orderId - Deve deletar o pedido', async () => {
    const orderRef = "PEDIDO-DELETE-88";
    await Order.deleteOne({ orderId: orderRef });

    await Order.create({
      orderId: orderRef,
      value: 10,
      creationDate: new Date(),
      items: [{ productId: testProduct.productId, quantity: 1, price: 10 }]
    });

    const res = await request(app)
      .delete(`/order/${orderRef}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(204);
  });
});