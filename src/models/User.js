const {mongoose}= require('mongoose');

const userSchema=new mongoose.Schema({
    roomID:{
        type:String,
        required:true
    },
    adminUserID:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    destination:{
        lat:{
            type:Number,
            
        },
        lng:{
            type:Number,
            
    }

    }
},{timestamps:true});
const User=mongoose.model("User",userSchema);
module.exports=User;
