const { Router } = require('express');
const userRoutes = require('./userRoutes');
const orderRoutes = require('./orderRoutes');

const routes = new Router();

routes.use(userRoutes);

routes.use('/order', orderRoutes); 

module.exports = routes;