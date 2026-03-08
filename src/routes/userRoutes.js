const { Router } = require('express');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const isAdmin = require('../middlewares/isAdmin');
const authMiddleware = require('../middlewares/auth');

const userRoutes = new Router();

userRoutes.post('/login', AuthController.login);
userRoutes.post('/user', authMiddleware, isAdmin, UserController.store);

module.exports = userRoutes;