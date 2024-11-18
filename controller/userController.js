const { StatusCodes} = require('http-status-codes');
const CustomError = require('../errors')
const User =  require('../model/User');
const{createTokenUser,attachCookiesToResponse,checkPermissions} = require('../utils/index');

const getAllUsers =  async(req,res)=>{
    
   const users = await User.find({role:'user'}).select('-password');
   res.status(StatusCodes.OK).json({users})
}
const getSingleUser =  async(req,res)=>{
   const user = await User.findOne({_id:req.params.id});
   if(!user){
  throw new CustomError.NotFoundError(`No user found with ${req.params.id}`);
   }
   console.log("req user in single user: "+req.user.name);
   checkPermissions(req.user,req.params.id);
   res.status(StatusCodes.OK).json({user});
}
const updateUser =  async(req,res)=>{
    const {name,email} = req.body;
    if(!name || !email){
        throw  new CustomError.BadRequestError("Please provide email and name");
    }
    const user = await User.findOneAndUpdate({_id:req.user.user._id},
        {email,name},
        {new:true,runValidators:true});
  const tokenUser =  createTokenUser({user});
  console.log(tokenUser);
  attachCookiesToResponse({res,user:tokenUser});
  res.status(StatusCodes.OK).json({user:tokenUser});
  
}
const showCurrentUser =  async(req,res)=>{
res.status(StatusCodes.OK).json({user:req.user});
}
const updatePassword =  async(req,res)=>{
   
   console.log(oldPassword,newPassword);
   if(!oldPassword || !newPassword){
    throw  new CustomError.BadRequestError("Please provide both passwords");
   }
   const user = await User.findOne({_id:req.user.userId});
   if(!user){
    throw new CustomError.NotFoundError(`user not found for ${req.user.userId}`);
   }
   const isPasswordMatch = await user.comparePassword(oldPassword);
   if(!isPasswordMatch){
    throw new CustomError.UnauthenticatedError("Invalid credential");

   }
   user.password = newPassword;
   await user.save();
   res.status(StatusCodes.OK).json({user,msg:"Password changed"});
}

module.exports={
    getAllUsers,getSingleUser,updatePassword,updateUser,showCurrentUser
}