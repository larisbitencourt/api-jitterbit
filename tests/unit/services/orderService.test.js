const OrderService = require('../../../src/services/OrderService');
const Order = require('../../../src/models/Order');
const Product = require('../../../src/models/Product');

jest.mock('../../../src/models/Order');
jest.mock('../../../src/models/Product');

describe('Teste Unitário - Order Service', () => {
  
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('Deve lançar erro se o produto não tiver estoque suficiente', async () => {
    const mockData = {
      numeroPedido: "JIT-ERR",
      items: [{ idItem: "PROD1", quantidadeItem: 10 }]
    };

    Order.findOne.mockResolvedValue(null);
    
    Product.findOne.mockResolvedValue({ productId: "PROD1", quantity: 5 });

    await expect(OrderService.createOrder(mockData))
      .rejects
      .toThrow('Estoque insuficiente para o produto PROD1. Disponível: 5');
  });

  it('Deve lançar erro se tentar criar um pedido com ID duplicado', async () => {
    const mockData = { numeroPedido: "JIT-999" };

    Order.findOne.mockResolvedValue({ orderId: "JIT-999" });

    await expect(OrderService.createOrder(mockData))
      .rejects
      .toThrow('Pedido duplicado: JIT-999 já existe.');
  });

  it('Deve criar o pedido e atualizar o estoque se tudo estiver OK', async () => {
    const mockData = {
      numeroPedido: "JIT-OK",
      valorTotal: 100,
      items: [{ idItem: "P1", quantidadeItem: 2, valorItem: 50 }]
    };

    Order.findOne.mockResolvedValue(null); 
    Product.findOne.mockResolvedValue({ productId: "P1", quantity: 10 }); 
    Order.create.mockResolvedValue({ orderId: "JIT-OK" }); 
    Product.updateOne.mockResolvedValue({ nModified: 1 }); 

    const result = await OrderService.createOrder(mockData);

    expect(result.orderId).toBe("JIT-OK");

    expect(Product.updateOne).toHaveBeenCalledWith(
      { productId: "P1" },
      { $inc: { quantity: -2 } }
    );
  });
});