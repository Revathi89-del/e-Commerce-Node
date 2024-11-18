const mongoose = require('mongoose');


const ReviewSchema =  new mongoose.Schema({
    rating:{
        type:Number,
        required:[true,"Please provide reviews"],
        min:1,
        max:5
    },
    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:50
    },
    comment:{
        type:String,
        required:[true,"please provide Comment"]
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
    required:true
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Product',
    required:true
    }
},{timestamps:true})
ReviewSchema.statics.calculateAverageRating = async function(productId){
    const result = await this.aggregate([
        { $match:{product:productId}},
        {
         $group:{
             _id:null,
             aveargeRating:{$avg:'$rating'},
             numofReviews:{$sum:1},
         }
        }
     ])
     console.log(result);
     try{
        await this.model('Product').findOneAndUpdate({_id:productId},{
            aveargeRating: Math.ceil(result[0]? aveargeRating :0),
            numofReviews:result[0]? numofReviews :0
        })
     }catch(error){

     }
    }
ReviewSchema.post('save',async function(){
await this.constructor.calculateAverageRating(this.product)
});
ReviewSchema.post('remove',async function(){
    await this.constructor.calculateAverageRating(this.product)
    });
ReviewSchema.index({user:1,product:1},{unique:true});

module.exports = mongoose.model('Review',ReviewSchema)