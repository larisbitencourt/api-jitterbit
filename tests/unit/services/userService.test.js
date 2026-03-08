const UserService = require('../../../src/services/UserService');
const User = require('../../../src/models/User');

jest.mock('../../../src/models/User');

describe('Unidade: UserService', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve criar um usuário e remover a senha do objeto de retorno', async () => {
    const userData = { name: 'Laris', email: 'laris@dev.com', password: '123' };
    
    User.findOne.mockResolvedValue(null);
    
    const mockCreatedUser = { 
      ...userData, 
      toObject: jest.fn().mockReturnValue({ name: 'Laris', email: 'laris@dev.com' }) 
    };

    User.create.mockResolvedValue(mockCreatedUser);

    const result = await UserService.createUser(userData);
    expect(result).not.toHaveProperty('password');
    expect(result.email).toBe('laris@dev.com');
    expect(User.create).toHaveBeenCalledWith(userData);
  });

  it('Deve lançar erro se o e-mail já estiver cadastrado', async () => {
    const userData = { email: 'existente@dev.com' };
    
    User.findOne.mockResolvedValue({ email: 'existente@dev.com' });

    await expect(UserService.createUser(userData))
      .rejects
      .toThrow('Usuário já cadastrado com este e-mail');
    
    expect(User.create).not.toHaveBeenCalled();
  });
});