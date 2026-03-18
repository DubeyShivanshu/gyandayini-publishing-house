const nodemailer = require('nodemailer');
const OTP = require('../models/OTP.model');

// 4-digit OTP generator
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Create mail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmailOTP = async (email) => {
  // Remove old OTPs for this email
  await OTP.deleteMany({ email });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await OTP.create({ email, otp, expiresAt });

  // Send email
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"Gyandayini Publishing House" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP - Gyandayini Publishing House',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #d4711e, #7a3219); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 22px;">ज्ञानदायिनी प्रकाशन</h1>
              <p style="color: #f5edd6; margin: 4px 0 0; font-size: 13px;">GYANDAYINI PUBLISHING HOUSE</p>
            </div>
            <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
              <p style="color: #374151; font-size: 15px; margin: 0 0 20px;">Your one-time verification code is:</p>
              <div style="background: #fdf7ed; border: 2px dashed #d4711e; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 20px;">
                <span style="font-size: 42px; font-weight: bold; color: #d4711e; letter-spacing: 12px;">${otp}</span>
              </div>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">This OTP is valid for <strong>5 minutes</strong> only. Do not share it with anyone.</p>
              <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">If you did not request this, please ignore this email.</p>
            </div>
          </div>
        `
      });
    } catch (err) {
      console.error('Email OTP send error:', err.message);
    }
  }

  // Return OTP in development for testing
  return {
    sent: true,
    otp: process.env.NODE_ENV === 'development' ? otp : undefined
  };
};

const verifyEmailOTP = async (email, inputOtp) => {
  const record = await OTP.findOne({ email: email.toLowerCase(), otp: inputOtp, isUsed: false });
  if (!record) return { valid: false, message: 'Invalid OTP. Please check and try again.' };
  if (new Date() > record.expiresAt) return { valid: false, message: 'OTP has expired. Please request a new one.' };

  record.isUsed = true;
  await record.save();
  return { valid: true };
};

module.exports = { sendEmailOTP, verifyEmailOTP };

