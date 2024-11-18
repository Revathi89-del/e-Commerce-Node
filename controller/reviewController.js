const Product =  require('../model/Product');
const { StatusCodes} = require('http-status-codes');
const CustomError = require('../errors')
const User =  require('../model/User');
const Review = require('../model/Review');
const{createTokenUser,attachCookiesToResponse,checkPermissions} = require('../utils/index');
const createReview = async(req,res)=>{

const {product:productId} = req.body;
const validProduct = Product.findOne({_id:productId});
if(!validProduct){
    throw new CustomError.BadRequestError(`No product find with id ${productId}`);
}
const alreadySubmitted = await Review.findOne({
    user:req.user.userId,
    product:productId

})
if(alreadySubmitted){
    throw new CustomError.BadRequestError(`Review submitted already.`);
}
req.body.user = req.user.userId;

const review = await Review.create(req.body)

    res.status(StatusCodes.CREATED).json({review});
}
const getSingleReview = async(req,res)=>{
   const {id:reviewId} = req.params;
   const review = await Review.findOne({_id:reviewId});
   if(!reviewId){
throw new CustomError.BadRequestError(`No review found for id ${reviewId}`);
   }
   res.status(StatusCodes.OK).json({review})
}
const getAllReviews = async(req,res)=>{
   const reviews = await Review.find().populate({path:'product',select:'name company price',});
   res.status(StatusCodes.OK).json({reviews});
}
const updateReview = async(req,res)=>{
    const{id:reviewId} = req.params;
    console.log(reviewId);
    const review = await Review.findOne({_id:reviewId});
   if(!review){
throw new CustomError.BadRequestError(`No review found for id ${reviewId}`);
   }
  console.log("The review object is"+review);
  // checkPermissions(req.user,review.user);


   review.rating = req.body.rating;
   review.title= req.body.title;
   review.comments = req.body.comments;
   await review.save();
   res.status(StatusCodes.OK).json({review});
}
const deleteReview = async(req,res)=>{
    const{id:reviewId} = req.params;
    const review = await Review.findOne({_id:reviewId});
   if(!reviewId){
throw new CustomError.BadRequestError({msg:`No review found for id ${reviewId}`});
   }
  
   checkPermissions(req.user,review.user);
   await Review.remove();
    res.status(StatusCodes.OK).json({msg:`Success! review removed.`})
}
module.exports ={
    createReview,updateReview,getAllReviews,getSingleReview,deleteReview
}