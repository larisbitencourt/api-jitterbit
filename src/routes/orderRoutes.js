const { Router } = require('express');
const OrderController = require('../controllers/OrderController');
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

const orderRoutes = new Router();


orderRoutes.get('/list', authMiddleware, OrderController.getAllOrders);

orderRoutes.get('/:orderId', authMiddleware, OrderController.getByOrderId);

orderRoutes.post('/', authMiddleware, isAdmin, OrderController.createOrder);

orderRoutes.put('/:orderId', authMiddleware, isAdmin, OrderController.updateOrder);

orderRoutes.delete('/:orderId', authMiddleware, isAdmin, OrderController.deleteOrder);

module.exports = orderRoutes;