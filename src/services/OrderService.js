const Order = require('../models/Order');

class OrderService {
  async createOrder(data) {
    const orderData = {
      orderId: data.numeroPedido,
      value: data.valorTotal,
      creationDate: data.dataCriacao,
      items: data.items.map(item => ({
        productId: item.idItem,
        quantity: item.quantidadeItem,
        price: item.valorItem
      }))
    };

    const newOrder = await Order.create(orderData);
    
    return newOrder;
  }
}

module.exports = new OrderService();