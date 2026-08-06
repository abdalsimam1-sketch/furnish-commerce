require("dotenv/config");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

const { authRouter } = require("./routes/auth.route");

const { errorHandler } = require("./middleware/errorHandler");
const { notFound } = require("./middleware/notFound");

//global middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

//security
app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
  }),
);
app.use(helmet());

//route
app.use("/api/v1/auth", authRouter);

//error handling
app.all("*any", notFound);
app.use(errorHandler);

module.exports = {
  app,
};
