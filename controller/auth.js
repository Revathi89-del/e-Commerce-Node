const User = require('../model/User');
const {StatusCodes} =  require('http-status-codes');
const CustomError =  require('../errors');
const {createJWT} = require('../utils');
const {attachCookiesToResponse,createTokenUser} = require('../utils')
const register = async(req,res)=>{

    const {email,name,password} = req.body;
    const emailAlreadyExists = await User.findOne({email});
   
    if(emailAlreadyExists){
        throw new CustomError.BadRequestError("Email already registered");
        
    }
    const isFirstAccount = (await User.countDocuments({})) === 0;
   
    const role =  isFirstAccount ? 'admin' : 'user';
    const user = await User.create({name,email,password,role});
    const tokenUser = createTokenUser(user);
   
   attachCookiesToResponse({res,user:tokenUser});

   res.status(StatusCodes.CREATED).json({user:tokenUser});
    
}
const login = async(req,res)=>{

const{email,password} = req.body;

if(!email || !password){
    throw new CustomError.BadRequestError("Please enter email and password.");
    
}
const user = await User.findOne({email})
if(!user){
    throw new CustomError.UnauthenticatedError(`No user found with id ${email}`)
    
}
const isPasswordMatch = await user.comparePassword(password);

if(!isPasswordMatch){
    throw new CustomError.BadRequestError(`Invalid credentials`)
}
const tokenUser = {name:user.name ,userId:user._id,role:user.role};
   
attachCookiesToResponse({res,user:tokenUser});

res.status(StatusCodes.CREATED).json({user:tokenUser});
}
const logout = async(req,res)=>{
    res.cookie('token',"logout",{
        httpOnly:true,
      
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({msg:"User Logged out"})
}
module.exports = {register,login,logout}