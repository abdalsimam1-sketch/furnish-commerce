const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (sendTo, token) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const { error, data } = await resend.emails.send({
    from: "Furnish Commerce <noreply@mail.abdals.site>",
    to: sendTo,
    subject: "Password Reset",
    html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h1>Welcome to Furnish Commerce!</h1>
        <p>Please click the button below to complete your password reset:</p>
        <div style="margin: 24px 0;">
          <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset my password
          </a>
        </div>
        <p style="font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
  if (error) {
    console.log(`Reset password email error : ${error}`);
  }
  return data;
};

module.exports = {
  sendPasswordResetEmail,
};
