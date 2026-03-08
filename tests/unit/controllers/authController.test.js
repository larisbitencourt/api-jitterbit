const AuthController = require('../../../src/controllers/AuthController');
const User = require('../../../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Unidade: AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    process.env.JWT_SECRET = 'secret_test';
    jest.clearAllMocks();
  });

  it('Deve retornar 200 e um token JWT quando as credenciais forem válidas', async () => {
    req.body = { email: 'laris@dev.com', password: '123' };
    
    const mockUser = { name: 'Laris', email: 'laris@dev.com', password: 'hash_password', role: 'admin' };
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign.mockReturnValue('token_fake_123');

    await AuthController.login(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: 'token_fake_123' });
  });

  it('Deve retornar 401 se a senha estiver incorreta', async () => {
    req.body = { email: 'laris@dev.com', password: 'senha_errada' };
    
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({ password: 'hash' })
    });
    
    bcrypt.compare.mockResolvedValue(false);

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário ou senha inválidos' });
  });

  it('Deve retornar 401 se o usuário não for encontrado', async () => {
    req.body = { email: 'inexistente@dev.com', password: '123' };
    
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});