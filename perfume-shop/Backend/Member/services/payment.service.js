const razorpay = require("../config/razorpay");

exports.createRazorpayOrder = async(amount,receipt)=>{

 return await razorpay.orders.create({
    amount:amount*100,
    currency:"INR",
    receipt
 });

};