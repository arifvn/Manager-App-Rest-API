require('colors');
require('dotenv').config({ path: './src/config/config.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (err) {
    console.log(`DB Connection Error ...`.red.bold);
  }

  console.log(`DB Connected ...`.green);
});

const deleteData = async () => {
  try {
    await User.deleteMany();

    console.log('Data Destroyed'.red.inverse);
  } catch (error) {
    console.log(`Error deleting data ...`.red.bold);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '-d') {
  deleteData();
}
