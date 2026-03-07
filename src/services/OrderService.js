const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderService {
  async createOrder(data) {

    for (const item of data.items) {
      const product = await Product.findOne({ productId: item.idItem });
      if (!product) {
        throw new Error(`Produto com ID ${item.idItem} não encontrado.`);
      }

     if (product.quantity < item.quantidadeItem) {
      throw new Error(`Estoque insuficiente para o produto ${item.idItem}. Disponível: ${product.quantity}`);
     }
    
     if (product.quantity <= 0) {
      throw new Error(`Produto com ID ${item.idItem} está com estoque zerado.`);
     }
    }

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

  async getAllOrders() {
    const orders = await Order.find().lean();
   
    return orders;
  
  }

  async getByOrderNumber(orderNumber) {

    const order = await Order.findOne({ orderId: orderNumber }).lean();
    
    if (!order) return null;

    return order;
  }

  async updateOrder(orderNumber, data) {

  if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        const productExists = await Product.findOne({ productId: item.idItem });
        if (!productExists) {
          throw new Error(`Produto com ID ${item.idItem} não encontrado.`);
        }
      }
    }
  
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

  return updatedOrder;
}

async deleteOrder(orderNumber) {
  return await Order.findOneAndDelete({ orderId: orderNumber });
}
}

module.exports = new OrderService();