const {createJWT,isToken,attachCookiesToResponse} = require('./jwt');
const{createTokenUser} = require('./createTokenUser');
const {checkPermissions} = require('./checkPermissions');
module.exports={
    createJWT,isToken,attachCookiesToResponse,createTokenUser,checkPermissions
}