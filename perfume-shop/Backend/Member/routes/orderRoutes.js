const router = require("express").Router();
const orderController =
require("../controllers/orderController");

router.post("/create-order",
orderController.createOrder);

module.exports = router;