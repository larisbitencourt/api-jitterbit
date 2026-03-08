const request = require('supertest');
const mongoose = require('mongoose');
const { expect } = require('chai');
const app = require('../../../src/server'); 
const User = require('../../../src/models/User');


describe('Integração: Users', () => {
  
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27018/api-jitterbit-test');
    }

    await User.deleteMany({ email: 'integration@test.com' });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('Deve criar um usuário real no banco de dados', async () => {
    const res = await request(app)
      .post('/user') 
      .send({
        name: 'Usuário Integração',
        email: 'integration@test.com',
        password: 'password123'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
    expect(res.body.email).to.equal('integration@test.com');
    expect(res.body).to.not.have.property('password');
  });
});