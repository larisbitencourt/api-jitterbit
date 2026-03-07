const { Router } = require('express');
const OrderController = require('../controllers/OrderController');

const routes = new Router();

routes.post('/order', OrderController.createOrder);

routes.get('/order/list', OrderController.getAllOrders);

routes.get('/order/:orderNumber', OrderController.getByOrderNumber);

routes.put('/order/:orderNumber', OrderController.updateOrder);

routes.delete('/order/:orderNumber', OrderController.deleteOrder);

module.exports = routes;