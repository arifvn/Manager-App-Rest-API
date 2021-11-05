const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config');

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);

    console.log(
      `DB Connected to :\n${conn.connections[0].host}`.yellow.inverse
    );

    conn.connection.on('error', (err) =>
      console.log(`DB Connection Error:\n${err}`.red.inverse)
    );

    conn.connection.on('disconnected', () =>
      console.log(`DB Disconnected`.red.inverse)
    );
  } catch (error) {
    console.log(`DB Connection Error:\n${error}`);
  }
};

module.exports = connectToDB;
