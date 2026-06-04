/**
 * Shared sample-data constants and helpers used by both the one-off CLI seeder
 * (server/seed.js) and the live node-cron seeder (server/jobs/liveSeeder.js).
 * Centralizing them keeps the two seeders in sync and avoids duplication.
 */

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

const getRandomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Build a single random sale payload for the given user.
 * `orderId` is intentionally omitted — the Sale model auto-generates it.
 * @param {mongoose.Types.ObjectId|string} userId  owner/creator of the sale
 * @param {Date} [date]  optional sale date (defaults to now)
 */
const buildRandomSale = (userId, date = new Date()) => {
  const category = getRandomItem(categories);
  const product = getRandomItem(productsByCategory[category]);
  const price = getRandomNumber(10, 1000);
  const quantity = getRandomNumber(1, 5);

  return {
    product,
    category,
    price,
    quantity,
    totalAmount: price * quantity,
    date,
    region: getRandomItem(regions),
    paymentMethod: getRandomItem(paymentMethods),
    customer: userId,
    createdBy: userId
  };
};

module.exports = {
  categories,
  regions,
  paymentMethods,
  productsByCategory,
  getRandomItem,
  getRandomDate,
  getRandomNumber,
  buildRandomSale
};
