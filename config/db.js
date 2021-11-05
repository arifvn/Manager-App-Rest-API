const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`DB Connected to : ${conn.connections[0].host}`.cyan.inverse);

    conn.connection.on('error', (err) =>
      console.log(`DB Connection Error: ${err}`.red.inverse)
    );

    conn.connection.on('disconnected', () =>
      console.log(`DB Disconnected`.red.inverse)
    );
  } catch (error) {
    console.log(`DB Connection Error: ${error}`);
  }
};

module.exports = connectToDB;
