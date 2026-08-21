const paymentsRouter = require("express").Router();

const paymentsController = require("../controllers/payments.controller");

const { authentication } = require("../middleware/authentication");
const { authorization } = require("../middleware/authorization");

paymentsRouter.use(authentication);

//get all payments
paymentsRouter.get("/", authorization("admin"), paymentsController.getPayments);
//get a user's payments
paymentsRouter.get("/user-payments", paymentsController.getUserPayments);
//initialize payment
paymentsRouter.post("/initialize", paymentsController.initializePayment);
//create payment
paymentsRouter.post("/webhook", paymentsController.webhook);
//get a specific payment
paymentsRouter.get("/:paymentId", paymentsController.getSpecificPayment);

module.exports = {
  paymentsRouter,
};
