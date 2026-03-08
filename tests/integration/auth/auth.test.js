const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../../../src/server');
const User = require('../../../src/models/User');

describe('Integração: Autenticação e Permissões', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27018/api-jitterbit-test');
    }
    await User.deleteMany({ email: { $in: ['admin-auth@test.com', 'user-auth@test.com'] } });

    await User.create({
      name: 'Admin Auth',
      email: 'admin-auth@test.com',
      password: 'password123',
      role: 'admin'
    });

    await User.create({
      name: 'User Auth',
      email: 'user-auth@test.com',
      password: 'password123',
      role: 'user'
    });
  });

  after(async () => {
    await User.deleteMany({ email: { $in: ['admin-auth@test.com', 'user-auth@test.com'] } });
  });

  it('POST /login - Deve retornar um token JWT válido para credenciais corretas', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'admin-auth@test.com', password: 'password123' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    expect(res.body.token).to.be.a('string');
  });

  it('POST /login - Deve retornar 401 para senha incorreta', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'admin-auth@test.com', password: 'senha-errada' });

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Usuário ou senha inválidos');
  });

  it('Middleware Auth - Deve retornar 401 se nenhum token for enviado', async () => {
    const res = await request(app).get('/order/list');

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Token inválido');
  });

  it('Middleware Auth - Deve retornar 401 para formato de token malformado', async () => {
    const res = await request(app)
      .get('/order/list')
      .set('Authorization', 'TokenSemBearer 12345');

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Token malformatado');
  });

  it('Middleware isAdmin - Deve retornar 403 se um usuário comum tentar acessar rota admin', async () => {
    const loginRes = await request(app)
      .post('/login')
      .send({ email: 'user-auth@test.com', password: 'password123' });

    const userToken = loginRes.body.token;

    const res = await request(app)
      .post('/order/')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ 
        numeroPedido: 'TESTE-ADMIN', 
        valorTotal: 10, 
        dataCriacao: new Date(),
        items: [] 
      });

    expect(res.status).to.equal(403);
    expect(res.body.message).to.contain('operação requer perfil de administrador');
  });
});