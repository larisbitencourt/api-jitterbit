const mongoose = require('mongoose');
const Product = require('./models/Product');

async function seed() {
  try {

    const mongoURI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/jitterbit_db';
    
    await mongoose.connect(mongoURI);
    
    const mockProducts = Array.from({ length: 20 }, (_, i) => ({
      productId: 2434 + i,
      quantity: Math.floor(Math.random() * 50) + 10,
      price: 1000 + (i * 50)
    }));

    await Product.deleteMany({}); 
    await Product.insertMany(mockProducts);
    
    console.log('✅ Base de dados populada com 20 produtos para o teste!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao popular produtos:', err);
    process.exit(1);
  }
}
seed();