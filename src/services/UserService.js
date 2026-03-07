const User = require('../models/User');

class UserService {
  async createUser(userData) {
    const { email } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('Usuário já cadastrado com este e-mail');
    }

    const user = await User.create(userData);
  
    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
  }
}

module.exports = new UserService();