const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true ,'Please provide name'],
        maxlength:20,
        minlength:3

    },
    email:{
        unique:true,
        type:String,
        required:[true,'Please provide email'],
        validate:{
            validator:validator.isEmail,
            message:"Please provide a valid email"
        }

    },
    password:{
        type:String,
        required:[true,"Please provide email"],
        minlength:5,
        maxlength:20
    },
    role:{
        type:String,
        enum:['admin','user'],
      default:'user'
    }
})

UserSchema.pre('save',async function(){
    const salt  = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password,salt);
})

UserSchema.methods.comparePassword =  async function(candidatePassword){
const isMatch = bcrypt.compare(candidatePassword,this.password);
return isMatch;
}
module.exports = mongoose.model("User",UserSchema);