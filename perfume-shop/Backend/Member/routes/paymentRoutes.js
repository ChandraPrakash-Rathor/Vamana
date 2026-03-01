const router = require("express").Router();
const paymentController =
require("../controllers/paymentController");

router.post("/verify-payment",
paymentController.verifyPayment);

module.exports = router;