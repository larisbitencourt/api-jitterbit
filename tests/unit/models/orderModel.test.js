const Order = require('../../../src/models/Order');

describe('Teste Unitário - Order Model', () => {
  
  it('Deve validar um objeto de Pedido de acordo com o Schema real', () => {
   
    const validOrder = new Order({
      orderId: "JIT-999",
      value: 150.50,
      creationDate: new Date(),
      items: [
        { productId: "1", quantity: 1, price: 150.50 }
      ]
    });

    const error = validOrder.validateSync();
    
    expect(error).toBeUndefined(); 
    expect(typeof validOrder.value).toBe('number');
  });

  it('Deve falhar se o orderId for obrigatório e não for enviado', () => {
    const invalidOrder = new Order({
      value: 100

    });
    
    const error = invalidOrder.validateSync();
    
    expect(error.errors.orderId).toBeDefined();
    expect(error.errors.orderId.kind).toBe('required');
  });
});