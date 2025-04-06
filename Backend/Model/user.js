
import mongoose from 'mongoose';

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
    }
})

// module.exports=mongoose.model('User',userSchema);

const User=mongoose.model('User',userSchema);

export {User};
