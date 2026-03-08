const UserController = require('../../../src/controllers/UserController');
const UserService = require('../../../src/services/UserService');

jest.mock('../../../src/services/UserService');

describe('Unidade: UserController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  it('Deve retornar 201 e os dados do usuário ao cadastrar com sucesso', async () => {
    const mockUser = { id: '123', name: 'Laris', email: 'laris@dev.com' };
    req.body = { name: 'Laris', email: 'laris@dev.com', password: '123' };

    UserService.createUser.mockResolvedValue(mockUser);

    await UserController.store(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('Deve retornar 400 se o service lançar um erro (ex: e-mail duplicado)', async () => {
    req.body = { email: 'repetido@dev.com' };
    
    UserService.createUser.mockRejectedValue(new Error('Usuário já cadastrado com este e-mail'));

    await UserController.store(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Erro no cadastro',
      message: 'Usuário já cadastrado com este e-mail'
    }));
  });
});