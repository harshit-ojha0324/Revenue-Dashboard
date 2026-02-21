const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const readline = require('readline');

// Load models
const User = require('./models/User');
const Sale = require('./models/Sale');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const categories = ['Electronics', 'Clothing', 'Food', 'Home', 'Beauty', 'Office', 'Other'];
const regions = ['North', 'South', 'East', 'West', 'Central'];
const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'PayPal', 'Other'];

const productsByCategory = {
  Electronics: ['Smartphone', 'Laptop', 'Tablet', 'Headphones', 'Smart Watch', 'Camera', 'TV', 'Gaming Console'],
  Clothing: ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Shoes', 'Hat', 'Socks', 'Sweater'],
  Food: ['Coffee', 'Pizza', 'Salad', 'Burger', 'Pasta', 'Steak', 'Sushi', 'Dessert'],
  Home: ['Sofa', 'Bed', 'Table', 'Chair', 'Lamp', 'Rug', 'Curtains', 'Pillow'],
  Beauty: ['Shampoo', 'Conditioner', 'Face Cream', 'Lipstick', 'Perfume', 'Nail Polish', 'Face Mask', 'Hair Dryer'],
  Office: ['Desk', 'Chair', 'Laptop Stand', 'Notebook', 'Pen Set', 'Stapler', 'Printer', 'Filing Cabinet'],
  Other: ['Gift Card', 'Subscription', 'Service Fee', 'Membership', 'Event Ticket', 'Donation', 'Custom Order', 'Miscellaneous']
};

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateOrderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  return (
    chars[Math.floor(Math.random() * chars.length)] +
    chars[Math.floor(Math.random() * chars.length)] +
    Array.from({ length: 6 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('')
  );
};

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
};

const generateSalesData = async (userId, numSales = 50) => {
  console.log(`Generating ${numSales} sales records...`);

  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  const salesData = Array.from({ length: numSales }).map(() => {
    const category = getRandomItem(categories);
    const product = getRandomItem(productsByCategory[category]);
    const price = getRandomNumber(10, 1000);
    const quantity = getRandomNumber(1, 5);
    const totalAmount = price * quantity;

    return {
      orderId: generateOrderId(),
      product,
      category,
      price,
      quantity,
      totalAmount,
      date: getRandomDate(oneYearAgo, today),
      region: getRandomItem(regions),
      paymentMethod: getRandomItem(paymentMethods),
      customer: userId,
      createdBy: userId
    };
  });

  await Sale.insertMany(salesData);
  console.log(`${numSales} sales records created successfully.`);
};

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('\nAdmin user already exists. Creating a regular user instead.\n');
      return createRegularUser();
    }

    console.log('\n=== Create Admin User ===\n');
    const name = await askQuestion('Enter admin name: ');
    const email = await askQuestion('Enter admin email: ');
    const password = await askQuestion('Enter admin password: ');

    const admin = new User({ name, email, password, role: 'admin' });
    await admin.save();
    console.log(`\nAdmin user created with email: ${email}\n`);

    const generateData = await askQuestion('Generate sales data for this admin user? (y/n): ');
    if (generateData.toLowerCase() === 'y') {
      const numSales = await askQuestion('How many sales records? (default: 50): ');
      await generateSalesData(admin._id, parseInt(numSales) || 50);
    }

    const createUser = await askQuestion('Create a regular user too? (y/n): ');
    if (createUser.toLowerCase() === 'y') {
      await createRegularUser();
    } else {
      mongoose.disconnect();
      rl.close();
      console.log('\n✅ Seeding complete.');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.disconnect();
    rl.close();
  }
};

const createRegularUser = async () => {
  try {
    console.log('\n=== Create Regular User ===\n');
    const name = await askQuestion('Enter user name: ');
    const email = await askQuestion('Enter user email: ');
    const password = await askQuestion('Enter user password: ');

    const user = new User({ name, email, password, role: 'user' });
    await user.save();
    console.log(`\nRegular user created with email: ${email}\n`);

    const generateData = await askQuestion('Generate sales data for this user? (y/n): ');
    if (generateData.toLowerCase() === 'y') {
      const numSales = await askQuestion('How many sales records? (default: 50): ');
      await generateSalesData(user._id, parseInt(numSales) || 50);
    }

    const createAnother = await askQuestion('Create another user? (y/n): ');
    if (createAnother.toLowerCase() === 'y') {
      await createRegularUser();
    } else {
      mongoose.disconnect();
      rl.close();
      console.log('\n✅ Seeding complete.');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    mongoose.disconnect();
    rl.close();
  }
};

const startSeeding = async () => {
  try {
    const clearData = await askQuestion('Clear all existing users and sales? (y/n): ');
    if (clearData.toLowerCase() === 'y') {
      await User.deleteMany({});
      await Sale.deleteMany({});
      console.log('All users and sales cleared.');
    }

    const isAdmin = await askQuestion('Create an admin user? (y/n): ');
    if (isAdmin.toLowerCase() === 'y') {
      await createAdminUser();
    } else {
      await createRegularUser();
    }
  } catch (error) {
    console.error('Error during seeding:', error);
    mongoose.disconnect();
    rl.close();
  }
};

console.log('\n📊 === Sales Dashboard Seeder ===');
console.log('This script creates users and dummy sales data.\n');

mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.host}`);
  startSeeding();
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
  rl.close();
  process.exit(1);
});
