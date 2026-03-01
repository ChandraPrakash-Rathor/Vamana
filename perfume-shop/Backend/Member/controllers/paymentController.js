const crypto = require("crypto");
const Order = require("../models/order");

exports.verifyPayment = async(req,res)=>{

 const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
 } = req.body;

 const body =
  razorpay_order_id+"|"+razorpay_payment_id;

 const expectedSignature =
  crypto.createHmac(
    "sha256",
    process.env.RAZORPAY_SECRET
  )
  .update(body)
  .digest("hex");

 if(expectedSignature === razorpay_signature){

   await Order.findOneAndUpdate(
     {razorpayOrderId:razorpay_order_id},
     {
       paymentStatus:"paid",
       razorpayPaymentId:razorpay_payment_id
     }
   );

   return res.json({success:true});
 }

 res.status(400).json({success:false});
};