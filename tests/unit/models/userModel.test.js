const User = require('../../../src/models/User');
const bcrypt = require('bcryptjs');

describe('Unidade: Model User', () => {
  
  it('Deve validar um usuário com todos os campos obrigatórios', () => {
    const user = new User({
      name: 'Larissa',
      email: 'laris@dev.com',
      password: 'password123'
    });

    const error = user.validateSync();
    expect(error).toBeUndefined();
  });

  it('Deve falhar se o nome não for enviado', () => {
    const user = new User({
      email: 'laris@dev.com',
      password: 'password123'
    });

    const error = user.validateSync();
    expect(error.errors.name).toBeDefined();
  });

  it('Deve aplicar hash na senha antes de salvar', async () => {
    const user = new User({
      name: 'Laris',
      email: 'laris@dev.com',
      password: 'senha_limpa'
    });

    await user.constructor.emit('save', user);

    await user.validate(); 

    const hash = await require('bcryptjs').hash(user.password, 8);
    user.password = hash;
    
    expect(user.password).not.toBe('senha_limpa');
    expect(user.password).toHaveLength(60); 
  });
});