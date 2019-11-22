const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const OrderControllers = require("../controllers/orders");

//Handling incoming GET requests to /orders
router.get("/", checkAuth, OrderControllers.orders_get_all);

//POST the Order created
router.post("/", checkAuth, OrderControllers.orders_create_order);

//GET Order by Id
router.get("/:orderId", checkAuth, OrderControllers.orders_get_order);

//DELETE Order by Id
router.delete("/:orderId", checkAuth, OrderControllers.orders_delete_order);

module.exports = router;
