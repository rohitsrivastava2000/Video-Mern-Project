import JWT from 'jsonwebtoken';
require("dotenv").config();


export const auth=async(req,res,next)=>{
    try {
        const token=req.cookies.token || req.header("Authorisation").replace("Bearer","");

        if(!token){
            res.status(402).json({
                success:false,
                message:"Token is Missing"
            })
        }
        try {
            const payload=JWT.verify(token,process.env.JWT_SECRET_KEY)
            req.user=payload;
        
        } catch (error) {
            return res.status(402).json({
                success:false,
                message:"Token is not Verified"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something wrong in Auth Section"
        })
    }
}