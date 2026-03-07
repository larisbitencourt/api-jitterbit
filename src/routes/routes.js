const { Router } = require('express');
const OrderController = require('../controllers/OrderController');
const UserController = require('../controllers/UserController')
const AuthController = require('../controllers/AuthController')
const authMiddleware = require('../middlewares/auth');

const routes = new Router();

routes.post('/login', AuthController.login);

routes.post('/user', UserController.store);

routes.get('/order/list', OrderController.getAllOrders);

routes.post('/order', authMiddleware, OrderController.createOrder);

routes.get('/order/:orderNumber', OrderController.getByOrderNumber);

routes.put('/order/:orderNumber', authMiddleware, OrderController.updateOrder);

routes.delete('/order/:orderNumber', authMiddleware, OrderController.deleteOrder);

module.exports = routes;