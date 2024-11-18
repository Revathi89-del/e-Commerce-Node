
const Product = require('../model/Product');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors')
const path = require('path');
const Review = require('../model/Review');
const getAllProducts = async(req,res)=>{
const products = await Product.find();
res.status(StatusCodes.OK).json({products});
}
const getSingleProduct = async(req,res)=>{
    const productId = req.params.id;
    const product = await Product.findOne({_id:productId}).populate('reviews');
    if(!product){
        throw new CustomError.BadRequestError(`No product find with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({product});
}
const createProduct = async(req,res)=>{
  
    req.body.user =  req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product});}
const updateProducts = async(req,res)=>{
    const productId = req.params.id;
    const product = await Product.findOneAndUpdate({_id:productId},req.body,{new:true,runValidators:true});
    if(!product){
        throw new CustomError.BadRequestError(`No product find with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({product});

    res.send("update products");
}
const deleteProducts = async(req,res)=>{
    const productId = req.params.id;
    const product = await Product.findOne({productId});
    console.log("In delete" +product);
    if(!product){
        throw new CustomError.BadRequestError(`No product find with id ${productId}`);
    }
    await product.remove();
    res.status(StatusCodes.OK).json({msg:"Success product removed"});
}
const uploadImage = async(req,res)=>{
   
    if(!req.files){
        throw new CustomError.BadRequestError(`Please upload an image`);
    }
    const productImage = req.files.image;
    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError(`Please upload an image file`);
    }
    const maxSize = 1024 * 1024 ;
    if(productImage.size > maxSize){
        throw new CustomError.BadRequestError(`Please upload image smaller than 1 MB`);
    }
    const imagePath =  path.join(__dirname,'../public/uploads/' + `${productImage.name}`);
    
    await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({image:`/uploads/${productImage.name}`});
}
const getSingleProductReview = async(req,res)=>{
const {id:productId} = req.params;
const reviews = await Review.find({product:productId});
res.status(StatusCodes.OK).json({reviews});
}
module.exports= {
    getAllProducts,getSingleProduct,createProduct,updateProducts,deleteProducts,uploadImage,getSingleProductReview
}