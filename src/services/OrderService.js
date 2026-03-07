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

    const orderObject = newOrder.toObject();

    delete orderObject._id;
    
    return orderObject;
  }

  async getAllOrders() {
    const orders = await Order.find().lean();
   
    return orders.map(order => {
      delete order._id;
      return order;
    });
  }

  async getByOrderNumber(orderNumber) {

    const order = await Order.findOne({ orderId: orderNumber }).lean();
    
    if (!order) return null;

    delete order._id;
    return order;
  }

  async updateOrder(orderNumber, data) {
  
  const updateData = {
    value: data.valorTotal,
    creationDate: data.dataCriacao,
    items: data.items?.map(item => ({
      productId: item.idItem,
      quantity: item.quantidadeItem,
      price: item.valorItem
    }))
  };

  const updatedOrder = await Order.findOneAndUpdate(
    { orderId: orderNumber },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedOrder) return null;

  delete updatedOrder._id;
  return updatedOrder;
}

async deleteOrder(orderNumber) {
  return await Order.findOneAndDelete({ orderId: orderNumber });
}
}

module.exports = new OrderService();