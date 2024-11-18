const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide product name"],
        maxlength:[100,"Name cannot be more than 100 characters"]
    },
    price:{
        type:Number,
        default:0,
        required:['true',"Please provide product price"]
    },
    description:{
        type:String,
        default:0,
        required:['true',"Please provide product description"],
        maxlength:[1000,"Name cannot be more than 1000 characters"]
    },
    image: 
    {
        type:String,
        default:'/uploads/examples.jpeg',
    },
 category:
  {
    type:String,
    required:['true',"Please provide product category"],
    enum:['office','kitchen','bedroom']

  },
 company: {
    type:String,
    required:['true',"Please provide product company"],
    enum:{
        values:['ikea','liddy','marcos'],
        message:'{value} is not supported'
    }
},
 colors: {type:[String],
    required:true
 },
 featured: {type:Boolean,dafault:false},
 freeShipping: {type:Boolean,default:false},
 inventory:{type:Number,required:true,default:15},
 averageRating:{type:Number,default:0},
 numOfReviews:{type:Number,default:0},
 user:{
    type:mongoose.Types.ObjectId,
    ref:'user',
    required:true
 }
},{timestamps:true ,toJSON:{virtuals:true},toObject:{virtuals:true}})

ProductSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'product',
    justOne:false
})
ProductSchema.pre('remove',async function(next) {
    await this.model('Review').deleteMany({product:this._id});
})
module.exports = mongoose.model('Product',ProductSchema)