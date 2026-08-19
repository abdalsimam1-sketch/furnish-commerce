const paymentsRouter = require("express").Router();

const paymentsController = require("../controllers/payments.controller");

//get all payments
paymentsRouter.get("/", paymentsController.getPayments);
//get a user's payments
paymentsRouter.get("/user-payments", paymentsController.getUserPayments);
//inintialize payment
paymentsRouter.post("/initialize", paymentsController.initializePayment);
//create payment
paymentsRouter.post("/webhook", paymentsController.webhook);
//get a specific payment
paymentsRouter.get("/:paymentId", paymentsController.getSpecificPayment);

module.exports = {
  paymentsRouter,
};
