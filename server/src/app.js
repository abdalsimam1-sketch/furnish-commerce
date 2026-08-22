require("dotenv/config");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { passport } = require("./config/passport");

const app = express();
app.set("trust proxy", 1);

const { authRouter } = require("./routes/auth.route");
const { categoriesRouter } = require("./routes/categories.route");
const { productsRouter } = require("./routes/products.route");
const { cartRouter } = require("./routes/cart.route");
const { ordersRouter } = require("./routes/orders.route");
const { paymentsRouter } = require("./routes/payments.route");

const { errorHandler } = require("./middleware/errorHandler");
const { notFound } = require("./middleware/notFound");

app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));

//global middleware
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/payments/webhook") return next();
  express.json()(req, res, next);
});
app.use(morgan("dev"));
app.use(cookieParser());
app.use(passport.initialize());

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
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
app.use(helmet());

//route
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/payments", paymentsRouter);

//error handling
app.all("*any", notFound);
app.use(errorHandler);

module.exports = {
  app,
};
