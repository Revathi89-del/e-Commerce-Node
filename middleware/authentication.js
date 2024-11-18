const CustomErr =  require('../errors');
const {IsToken} = require('../utils/jwt');

const authenticateUser =  async(req,res,next)=>{
    const token = req.signedCookies.token;
   
    if(!token){
        throw new CustomErr.UnauthenticatedError("Invalid credentials")
    }
    try{
        const {name,userId,role} = IsToken({token});
        req.user = {name,userId,role}
        console.log("setting request user:"+req.user.name);
        next();
    }catch(error){
        throw new CustomErr.UnauthenticatedError("Authentication Invalid");
    }
  
}
const authorizePermissions = (...roles)=>{
return(req,res,next)=>{
    if(!roles.includes(req.user.role)){
        throw new CustomErr.UnauthorizedError('Unauthorized user');
    }
    console.log("Authorized user");
    next();
}
    
    
  
}
module.exports = {
    authenticateUser,authorizePermissions
}