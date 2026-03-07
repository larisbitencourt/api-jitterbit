const { Router } = require('express');
const OrderController = require('../controllers/OrderController');
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

const orderRoutes = new Router();


orderRoutes.get('/list', authMiddleware, OrderController.getAllOrders);

orderRoutes.get('/:orderNumber', authMiddleware, OrderController.getByOrderNumber);

orderRoutes.post('/', authMiddleware, isAdmin, OrderController.createOrder);

orderRoutes.put('/:orderNumber', authMiddleware, isAdmin, OrderController.updateOrder);

orderRoutes.delete('/:orderNumber', authMiddleware, isAdmin, OrderController.deleteOrder);

module.exports = orderRoutes;