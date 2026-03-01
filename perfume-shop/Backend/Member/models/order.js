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

  paymentStatus:{
    type:String,
    enum:["pending","paid","failed"],
    default:"pending"
  },

  razorpayOrderId:String,
  razorpayPaymentId:String

},{timestamps:true});

module.exports = mongoose.model("Order",OrderSchema);