const dashboardRouter = require("express").Router();
const { authentication } = require("../middleware/authentication");
const { authorization } = require("../middleware/authorization");
const dashboardControllers = require("../controllers/dashboard.controller");

dashboardRouter.get(
  "/",
  authentication,
  authorization("admin"),
  dashboardControllers.getDashboard,
);

module.exports = {
  dashboardRouter,
};
