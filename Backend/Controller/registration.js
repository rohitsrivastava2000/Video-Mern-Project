import  httpStatus  from "http-status";
import bcrypt from 'bcrypt';
import { User } from "../Model/user.js";
import JWT from 'jsonwebtoken';
import 'dotenv/config'

export const register=async(req,res)=>{
    const {name ,userName,email,password}=req.body;

    try {
        const existingUser=await User.findOne({userName:userName})
        if(existingUser){
            return res.status(200).json({
                success:false,
                message:"Username Already Exists"
            })
        }
        const existingEmail=await User.findOne({email:email})
        if(existingEmail){
            return res.status(200).json({
                success:false,
                message:"User Email Already Exists"
            })
        }
        const hashPassword=await bcrypt.hash(password,10);
        
        console.log("object")
        const response=await User.create({
            name,
            userName,
            email,
            password:hashPassword,
            token:""
        })
        console.log(response)
        return res.status(httpStatus.CREATED).json({
            success:true,
            message:"Registered Successfully..."
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server During the Registration"
        })
    }

}


export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password)
            {
                return res.status(200).json({
                    success:false,
                    message:"All field are Mandatory"
                })
            }
            const userResponse=await User.findOne({email})
            if(!userResponse){
                return res.status(200).json({
                    success:false,
                    message:"User Not Registered.."
                })
            }
            //
            if(!( await bcrypt.compare(password,userResponse.password))){
                return res.status(200).json({
                    success:false,
                    message:"Password Miss Matched"
                })
            }
            const payLoad={
                id:userResponse._id,
                userName:userResponse.userName,            
                email:userResponse.email,
                
            }
            
            const token=JWT.sign(payLoad,process.env.JWT_SECRET_KEY,{expiresIn:"12h"})
            console.log("object")
        

           userResponse.token=token;
           await userResponse.save();

        
        const options={
            expires: new Date(Date.now()+5*24*60*60*1000),
            httpOnly:true
        }
        // console.log("login");
        return res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            userResponse,
            message:"User Login Successfully"
        })
   
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something Problem in Login Section",
            errro:error
        })
    }
}

// export default {login,register}
// module.exports={login,register};