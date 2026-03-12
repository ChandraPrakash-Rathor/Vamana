const router = require("express").Router();
const orderController =
require("../controllers/orderController");

router.post("/create-order",
orderController.createOrder);

router.post("/verify-payment",
orderController.verifyPayment);

router.get("/user-orders",
orderController.getUserOrders);

router.get("/:id",
orderController.getOrderById);

module.exports = router;