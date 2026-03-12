const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

  userId:String,

  products:[{
    productId:String,
    quantity:Number,
    price:Number
  }],

  totalAmount:Number,

  address:Object,

  paymentMethod:{
    type:String,
    enum:["razorpay","cod"],
    default:"razorpay"
  },

  paymentStatus:{
    type:String,
    enum:["pending","paid","failed"],
    default:"pending"
  },

  trackingStatus:{
    type:String,
    enum:["ordered","processing","shipped","out_for_delivery","delivered"],
    default:"ordered"
  },

  razorpayOrderId:String,
  razorpayPaymentId:String,
  razorpaySignature:String

},{timestamps:true});

module.exports = mongoose.model("Order",OrderSchema);