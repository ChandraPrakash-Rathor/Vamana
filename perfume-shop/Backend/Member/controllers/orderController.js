const Order = require("../models/order");
const {createRazorpayOrder} =
require("../services/payment.service");

exports.createOrder = async(req,res)=>{

 try{

   const {userId,products,address,totalAmount} = req.body;

   // 1️⃣ DB Order (Pending)
   const order = await Order.create({
     userId,
     products,
     address,
     totalAmount
   });

   // 2️⃣ Razorpay Order
   const razorOrder =
     await createRazorpayOrder(
        totalAmount,
        order._id.toString()
     );

   // 3️⃣ Save Razorpay ID
   order.razorpayOrderId = razorOrder.id;
   await order.save();

   res.json({
     razorpayOrderId:razorOrder.id,
     amount:razorOrder.amount
   });

 }catch(err){
   res.status(500).json(err);
 }
};