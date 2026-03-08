const { Router } = require('express');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');

const userRoutes = new Router();

userRoutes.post('/login', AuthController.login);
userRoutes.post('/user', UserController.store);

module.exports = userRoutes;