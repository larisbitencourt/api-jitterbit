require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const Product = require('./models/Product');
const User = require('./models/User'); 

async function seed() {

  await new Promise(resolve => setTimeout(resolve, 5000))
  
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/jitterbit_db';
    await mongoose.connect(mongoURI);


    await Product.deleteMany({});
    await User.deleteMany({});
  
    const mockProducts = Array.from({ length: 20 }, (_, i) => ({
      productId: (1 + i).toString(),
      quantity: Math.floor(Math.random() * 50) + 10,
      price: 1000 + (i * 50)
    }));

    await Product.insertMany(mockProducts);

    const salt = await bcrypt.genSalt(10);
    const hashedEmailPassword = await bcrypt.hash('123', salt);

    const mockUsers = [
      {
        name: 'Larissa Administrator',
        email: 'admin@teste.com',
        password: hashedEmailPassword,
        role: 'admin'
      },
      {
        name: 'Larissa User',
        email: 'user@teste.com',
        password: hashedEmailPassword,
        role: 'user'
      }
    ];

    await User.insertMany(mockUsers);
    
    console.log('✅ Base de dados populada!');
    console.log('📦 20 produtos criados.');
    console.log('👥 Usuários: admin@teste.com (admin) e user@teste.com (user). Senha: 123');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao popular banco:', err);
    process.exit(1);
  }
}
seed();