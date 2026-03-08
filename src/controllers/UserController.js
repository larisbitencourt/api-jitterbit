const UserService = require('../services/UserService');

class UserController {
  async store(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ 
        error: 'Erro no cadastro', 
        message: error.message 
      });
    }
  }
}

module.exports = new UserController();