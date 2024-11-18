const mongoose = require('mongoose')
const SingleOrderItemSchema =  new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},
    price:{type:Number,required:true},
    amount:{type:Number,required:true},
    product:{
        type:mongoose.Types.ObjectId,
        ref:"product",
        required:true
    },
})
const OrderSchema = new mongoose.Schema({
    tax : {
        type:Number,
        required:true
    },
 shippingFee: {
    type:Number,
    required:true},
 subtotal: {
    type:Number,
    required:true
 },
total: {
    type:Number
},
 orderItems:[SingleOrderItemSchema],
    status:{
        type:String,
        enum:['pending','paid','canceled','delivered','failed'],
        default:'pending'
    }
 ,
 status:{type:String},
 user:{
    type:mongoose.Types.ObjectId,
    ref:"user",
    required:true
 },
 clientSecret:{
    type:String,

},
 paymentIntentId:{
    type:String
}
},{timestamps:true});
module.exports = mongoose.model('Order',OrderSchema);