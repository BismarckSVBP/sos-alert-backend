import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  requireTLS: Number(process.env.EMAIL_PORT) === 587, // enforce TLS on 587
  connectionTimeout: 10000, // prevent ETIMEDOUT too quickly
});

export const sender = {
  email: process.env.SENDER_EMAIL,
  name: process.env.SENDER_NAME,
};

export const adminEmail = process.env.ADMIN_EMAIL;

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Error connecting to email server:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});
