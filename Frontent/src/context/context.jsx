import { children, createContext, useState } from "react";
import axios from "axios";
import server from "../pages/environmentFile";



export const MyContext=createContext({});

const client=axios.create({
    baseURL:`${server}/api/v1/users`
})

export const MyProvider=({children})=>{

   

    const handleRegister=async (name,userName,email,password)=>{
        try {
            console.log(name);
            console.log(userName);
            console.log(email);
            console.log(password)
            const response=await client.post('/signup',{
                name,userName,email,password
            })
          //  console.log(response.data + "haddlee")
            return response.data;
            
            
        } catch (error) {
            console.log("handle")
            console.log(error)
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