import { User } from "../Model/user.js";
import {Meeting} from '../Model/meeting.js'
import JWT from 'jsonwebtoken';


export const getUserHistory=async(req,res)=>{
    console.log("g0");
    const token = req.headers.authorization?.split(" ")[1];

    try {
       
       console.log(token) 
       
       const userDetail=await User.findOne({token:token}); 
       console.log(userDetail) 
       const meetingDetail=await Meeting.find({user_id:userDetail.userName}).sort({ createdAt: -1 }).exec();
       
       console.log(meetingDetail)
       return res.status(200).json({
        success:true,
        message:`getting meeting detaill successfully`,
        response:meetingDetail
       })
    
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`something went wrong in getting meeting detaill${error}`
            
           })
    }


}

export const addToUserHistory=async(req,res)=>{
    const {token,meeting_code}=req.body;

    try {
        
        if(!meeting_code){
            return res.status(401).json({
                success:false,
                message:"Meeting Code Is Required"
            })
        }
        const userDetail=await User.findOne({token:token})
        
        const newMeeting=new Meeting({
            user_id:userDetail.userName,
            meeting_id:meeting_code
        })
        console.log(newMeeting);
        await newMeeting.save();
       
        return res.status(200).json({
            success:true,
            message:"History Added Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`Something went wrong ${error}`
        })
    }
}