require('colors');
const dotenv = require('dotenv');
const express = require('express');

const connectToDB = require('./config/db');

// Config
dotenv.config({ path: './config/config.env' });
connectToDB();
const app = express();

// Server
const PORT = process.env.PORT || 5000;
const SERVER = app.listen(PORT, () =>
  console.log(
    `Server listening in ${process.env.NODE_ENV} on port ${PORT}`.green.inverse
  )
);

// Unhandle Rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error : ${err.message}`.red.bold);
  SERVER.close(() => process.exit(1));
});
