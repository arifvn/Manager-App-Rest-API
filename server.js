require('colors');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { PORT, NODE_ENV } = require('./src/config/config');
const connectToDB = require('./src/config/db');
const auth = require('./src/routes/auth.route');
const users = require('./src/routes/users.route');
const errorHandler = require('./src/middlewares/errorHandler');

// DB
connectToDB();

// MIDDLEWARES
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(cors());
if (NODE_ENV === 'development') {
  app.use(logger('dev'));
}
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 100,
    handler: (req, res, next, options) => {
      res
        .status(options.statusCode)
        .send({ success: false, error: options.message });
    },
  })
);

// ROUTES
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use(errorHandler);

// SERVER
const main = () => {
  const server = app.listen(PORT || 5000, () =>
    console.log(
      `Server listening in ${NODE_ENV} on port ${PORT || 5000}`.green.inverse
    )
  );

  process.on('unhandledRejection', (err) => {
    console.log(`Error : ${err.message}`.red.bold);
    server.close(() => process.exit(1));
  });
};

main();
