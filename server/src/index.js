require("dotenv/config");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const app = express();

const { authRouter } = require("./routes/auth.route");

const { errorHandler } = require("./middleware/errorHandler");
const { notFound } = require("./middleware/notFound");

//global middleware
app.use(express.json());
app.use(morgan("dev"));

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
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      status: "fail",
      message:
        "Too many requests from this IP, please try again after 15 minutes.",
    },
  }),
);

//route
app.use("/api/v1/auth", authRouter);

//error handling
app.all("*any", notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}....`);
});
