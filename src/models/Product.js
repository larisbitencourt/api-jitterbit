const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: { type: Number, required: true, unique: true }, 
  quantity: Number,
  price: Number
});

module.exports = mongoose.model('Product', ProductSchema);