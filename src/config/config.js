require('dotenv').config({ path: './src/config/config.env' });

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_LOCAL: process.env.MONGODB_LOCAL,

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRE: process.env.JWT_EXPIRE,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
};
