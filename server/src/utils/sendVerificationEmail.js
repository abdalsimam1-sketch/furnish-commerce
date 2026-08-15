const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (sendTo, token) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const { error, data } = await resend.emails.send({
    from: "Furnish Commerce <noreply@mail.abdals.site>",
    to: sendTo,
    subject: "Email verification",
    html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h1>Welcome to Furnish Commerce!</h1>
        <p>Thank you for creating an account. Please click the button below to complete your registration:</p>
        <div style="margin: 24px 0;">
          <a href="${verificationLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Verify My Account
          </a>
        </div>
        <p style="font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.log(`Verification email error : ${error}`);
  }
  return data;
};

module.exports = {
  sendVerificationEmail,
};
