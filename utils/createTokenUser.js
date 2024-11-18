
const createTokenUser =  ({user})=>{
    return {
        name:user.name,
        id:user.id,
        role:user.role
    }
   
}
module.exports = {createTokenUser};