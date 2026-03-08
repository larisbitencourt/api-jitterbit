const OrderController = require('../../../src/controllers/OrderController');
const OrderService = require('../../../src/services/OrderService');

jest.mock('../../../src/services/OrderService');

describe('Unidade: OrderController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(), 
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  it('Deve retornar 201 e o pedido ao criar com sucesso', async () => {
    req.body = { numeroPedido: 'JIT-123' };
    const mockOrder = { orderId: 'JIT-123', value: 100 };

    OrderService.createOrder.mockResolvedValue(mockOrder);

    await OrderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockOrder);
  });

  it('Deve retornar 200 e a lista de pedidos no getAllOrders', async () => {
    const mockOrders = [
      { orderId: 'JIT-001', value: 100 },
      { orderId: 'JIT-002', value: 200 }
    ];

    OrderService.getAllOrders.mockResolvedValue(mockOrders);

    await OrderController.getAllOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  it('Deve retornar 404 quando o pedido não existe no getByOrderId', async () => {
    req.params.orderId = 'INVALIDO';
    
    OrderService.getByOrderId.mockResolvedValue(null);

    await OrderController.getByOrderId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Não encontrado, verifique o número do pedido'
    }));
  });

  it('Deve retornar 200 quando o pedido for atualizado com sucesso', async () => {
    req.params.orderId = 'JIT-010';
    req.body = { valorTotal: 500 };
    const mockUpdatedOrder = { orderId: 'JIT-010', value: 500 };

    OrderService.updateOrder.mockResolvedValue(mockUpdatedOrder);

    await OrderController.updateOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUpdatedOrder);
  });

  it('Deve retornar 404 se o pedido não existir para atualização', async () => {
    req.params.orderId = 'NAO-EXISTE';
    
    OrderService.updateOrder.mockResolvedValue(null);

    await OrderController.updateOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Pedido não encontrado para atualização'
    }));
  });

  it('Deve retornar 204 ao deletar com sucesso', async () => {
    req.params.orderId = 'JIT-DELETE';
    OrderService.deleteOrder.mockResolvedValue(true);

    await OrderController.deleteOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});