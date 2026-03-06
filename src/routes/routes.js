const { Router } = require('express');
const OrderController = require('../controllers/OrderController');

const routes = new Router();

routes.post('/order', OrderController.createOrder);

routes.get('/order/list', OrderController.getAllOrders);

module.exports = routes;