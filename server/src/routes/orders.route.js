const ordersRouter = require("express").Router();
const ordersController = require("../controllers/orders.controller");

const { authentication } = require("../middleware/authentication");
const { authorization } = require("../middleware/authorization");

ordersRouter.use(authentication);

//get all orders //admin
ordersRouter.get("", authorization("admin"), ordersController.getOrders);

//create order
ordersRouter.post("/create-order", ordersController.createOrder);

//get user's order by userId
ordersRouter.get("/user-orders", ordersController.getUserOrders);

//get specific order
ordersRouter.get(
  "/:orderId",
  authorization("admin", "customer"),
  ordersController.getSpecificOrder,
);

//update order status //admin
ordersRouter.patch(
  "/update/:orderId",
  authorization("admin"),
  ordersController.updateOrderStatus,
);

//cancel order
ordersRouter.patch(
  "/cancel/:orderId",
  authorization("admin", "customer"),
  ordersController.cancelOrder,
);

//paystack endpoint

module.exports = {
  ordersRouter,
};
