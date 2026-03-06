const OrderService = require('../services/OrderService');

class OrderController {
  async createOrder(req, res) {
    try {
      const order = await OrderService.createOrder(req.body);
        return res.status(201).json(order);
      
    } catch (error) {
        return res.status(400).json({ 
        error: 'Falha ao criar o pedido', 
        message: error.message 
      });
    }
  }
}

module.exports = new OrderController();