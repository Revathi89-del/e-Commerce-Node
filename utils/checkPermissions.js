const CustomError = require('../errors');

const checkPermissions =(requestUser,resourceUserId)=>{

    if(requestUser.role === 'admin')return;
    console.log(requestUser.id,resourceUserId.toString());
    if(requestUser.id === resourceUserId.toString())return;
    throw new CustomError.BadRequestError("No authorized to use this route");


}
module.exports = {checkPermissions}