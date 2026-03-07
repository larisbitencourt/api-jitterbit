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

  async getAllOrders(_req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
    }
  }

  async getByOrderNumber(req, res) {
    try {
      const { orderNumber } = req.params; 
      const order = await OrderService.getByOrderNumber(orderNumber);
      
      if (!order) {
        return res.status(404).json({ message: 'Não encontrado, verifique o número do pedido' });
      }
      
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
    }
  }

  async updateOrder(req, res) {
  try {
    const { orderNumber } = req.params;
    const updatedOrder = await OrderService.updateOrder(orderNumber, req.body);

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado para atualização' });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(400).json({ 
      message: 'Erro ao atualizar pedido', 
      error: error.message 
    });
  }
}

async deleteOrder(req, res) {
  try {
    const { orderNumber } = req.params;
    const deletedOrder = await OrderService.deleteOrder(orderNumber);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado para exclusão' });
    }

    return res.status(204).send(); 
  } catch (error) {
    return res.status(500).json({ 
      message: 'Erro ao deletar pedido', 
      error: error.message 
    });
  }
}
}

module.exports = new OrderController();