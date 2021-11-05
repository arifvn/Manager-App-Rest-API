const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.verify();

  const info = await transporter.sendMail({
    from: `${process.env.SMTP_FROM_NAME} 👻 <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    text,
  });

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
