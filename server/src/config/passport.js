const { prisma } = require("./prisma");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const name = profile?.displayName;
        const email = profile?.emails?.[0]?.value;
        const image = profile?.photos?.[0]?.value;

        let user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              name,
              email,
              image,
              isVerified: true,
              authProvider: "google",
            },
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

module.exports = { passport };
