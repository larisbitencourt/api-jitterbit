const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  value: { 
    type: Number, 
    required: true 
  },
  creationDate: { 
    type: Date, 
    required: true 
  },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ]
});

OrderSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();

  update.$inc = { __v: 1 };
  
  next();
});

module.exports = mongoose.model('Order', OrderSchema);