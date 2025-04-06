import { children, createContext, useState } from "react";
import axios from "axios";


export const MyContext=createContext({});

const client=axios.create({
    baseURL:'http://localhost:5000/api/v1/users'
})

export const MyProvider=({children})=>{

   const [emailLocal,setEmailLocal]=useState("");

    const handleRegister=async (name,userName,email,password)=>{
        try {
            const response=await client.post('/signup',{
                name,userName,email,password
            })
            
            return response.data;
            
            
        } catch (error) {
            throw error
        }
    }
    const handleLogin=async (email,password)=>{
        try {
            const response=await client.post('/login',{
                email,password
            })
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const getUserHistory=async()=>{
        try {
            console.log("frontent")
            const response=await client.get('/get_all_activity',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
                   
               
            })
            console.log(response.data)
            return response.data.response;
        } catch (error) {
            throw error;
        }
    }

    const addUserHistory=async(meeting_code)=>{
        try {
            console.log(meeting_code)
            console.log(localStorage.getItem('token'))
            const response=await client.post('/add_to_activity',{
                token:localStorage.getItem('token') ,meeting_code
            })
            return response.data;
        } catch (error) {
            throw error;
        }
    }




    const info={
        handleLogin,handleRegister,addUserHistory,getUserHistory

    }

    return (
        <MyContext.Provider value={info} >
            {children}
        </MyContext.Provider>
    )
}