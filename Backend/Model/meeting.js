import mongoose from 'mongoose';

const meetingSchema=mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    meeting_id:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const Meeting=mongoose.model('Meeting',meetingSchema);

export {Meeting};