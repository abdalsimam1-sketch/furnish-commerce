const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    pass: process.env.APP_PASSWORD,
    user: process.env.USER_EMAIL,
  },
});

const sendPasswordResetEmail = async (sendTo, token) => {
  const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const email = await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: sendTo,
    subject: "Reset Password",
    html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h1>Welcome to Furnish Commerce!</h1>
        <p>Please click the button below to complete your password reset:</p>
        <div style="margin: 24px 0;">
          <a href="${resetPasswordLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset my password
          </a>
        </div>
        <p style="font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

module.exports = {
  sendPasswordResetEmail,
};
