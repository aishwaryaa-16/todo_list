import dotenv from 'dotenv';

dotenv.config();

import nodemailer from 'nodemailer';

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // use SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export default transporter