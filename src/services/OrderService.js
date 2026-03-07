const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderService {
  async createOrder(data) {

    const checkOrderExists = await Order.findOne({ orderId: data.numeroPedido });

    if (checkOrderExists) {
    throw new Error(`Pedido duplicado: ${data.numeroPedido} já existe.`);
  }

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

   const quantityItemsUpdate = data.items.map(item => 
     Product.updateOne(
      { productId: item.idItem },
      { $inc: { quantity: -item.quantidadeItem } }
    )
   );

    await Promise.all(quantityItemsUpdate);
    
    return newOrder;
  }

  async getAllOrders() {
    const orders = await Order.find().lean();
   
    return orders;
  
  }

  async getByOrderId(orderId) {

    const order = await Order.findOne({ orderId: orderId }).lean();
    
    if (!order) return null;

    return order;
  }

  async updateOrder(orderId, data) {

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
    { orderId: orderId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedOrder) return null;

  return updatedOrder;
}

async deleteOrder(orderId) {
  return await Order.findOneAndDelete({ orderId: orderId });
}
}

module.exports = new OrderService();