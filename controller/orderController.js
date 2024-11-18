const Order = require('../model/Order');
const Product = require('../model/Product');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const {CheckPermissions, checkPermissions} = require('../utils/checkPermissions');
const fakeStripeAPI =  async({amount,currency})=>{
    const client_secret = 'someRandomValue';
    return{client_secret,amount};
}
const createOrder = async(req,res)=>{
   const{items:cartItems,tax,shippingFee} = req.body;
   console.log(cartItems.length);
   if(!cartItems || cartItems.length <= 0){
    throw new CustomError.BadRequestError("Please add items")
   }
   if(!tax || !shippingFee){
    throw new CustomError.BadRequestError("Please add tax and shipping fee")
   }
   let orderItems =[];
   let subTotal =0;
   for(item of cartItems){
    const dbProduct = await Product.findOne({_id:item.product});
    if(!dbProduct){
        throw new CustomError.BadRequestError("Product not found")
    }
        const{name,price,image,id} = dbProduct;

        const SingleOrderItem = {
            amount:item.amount,
            name,
            image,
            price,
            product:id
        }
        orderItems =[...orderItems,SingleOrderItem];
        subTotal+= item.amount * price;
       
   }
   const total = tax + shippingFee;
   const paymentIntent = await fakeStripeAPI({
    amount:total,
    currency:'usd'
   })
  
   const order = await Order.create({
    orderItems,
    total,
    shippingFee,
    tax,
    subtotal:subTotal,
    user:req.user.userId,
    clientSecret: paymentIntent.client_secret
   })
   console.log(order);
  res.status(StatusCodes.CREATED).json({order,clientSecret:order.clientSecret});
}
const getSingleOrder = async(req,res)=>
{
    const {id:orderId} = req.params;
    const order = await Order.findOne({orderId});
    if(!order){
        throw new CustomError.BadRequestError(`No order found for the id ${orderId}`);
    }
    checkPermissions(req.user,order.user);
    res.status(StatusCodes.OK).json(order);
}
const getAllOrders = async(req,res)=>{
    const order = await Order.find({});
    res.status(StatusCodes.OK).json({order});
}
const updateOrder =async(req,res)=>{
    const {id:orderId} = req.params;
   
    const {paymentIntentId} = req.body;
    const order = await Order.findOne({orderId});
    if(!order){
        throw new CustomError.BadRequestError(`No order found for the id ${orderId}`);
    }
    checkPermissions(req.user,order.user);
  order.paymentIntentId = paymentIntentId;
    order.status ='paid';
    await order.save();
   res.status(StatusCodes.OK).json({order})
}
const getCurrentUserOrders = async(req,res)=>{
const orders = await Order.find({user:req.user.userId});
res.status(StatusCodes.OK).json({orders,count:orders.length});
}
module.exports={
    createOrder,getSingleOrder,getAllOrders,updateOrder,getCurrentUserOrders
}