require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 


class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos' });
      }
      
      const token = jwt.sign(
        { name: user.name, email: user.email, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' } 
      );

      return res.json({
        user: { name: user.name, email: user.email, role: user.role },
        token
      });

    } catch (error) {
      return res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }
}

module.exports = new AuthController();