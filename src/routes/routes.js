const { Router } = require('express');
const OrderController = require('../controllers/OrderController');

const routes = new Router();

routes.post('/orders', OrderController.createOrder)

module.exports = routes;