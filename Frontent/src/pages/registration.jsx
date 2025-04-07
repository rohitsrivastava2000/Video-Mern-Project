import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, replace, useNavigate } from "react-router-dom";
import  {MyContext}  from "../context/context.jsx";

export default function Registration() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName,setFullName]=useState('');
  const [userName,setUserName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [isLoginIn,setIsLoginIn]=useState(true);//protect the route

  const {handleLogin,handleRegister,setEmailLocal}=useContext(MyContext);  

  
  useEffect(()=>{
    const token=localStorage.getItem('token');
    if(token)
      navigate('/',{replace:true})
  },[])
  
  const navigate=useNavigate();

  const handleSubmit=async (e)=>{
      e.preventDefault();
      console.log("object")
      try {
        if(!isLogin){
          //sign up
          const response=await handleRegister(fullName, userName,email,password)
          if(response.success){
            console.log(response.message)
            setIsLogin(true);
          }
          else{
            console.log(response.message);
          }
        }
        if(isLogin)
        {
          //login
          const response =await handleLogin(email,password);
          if(response.success){
            console.log(response.message);
            localStorage.setItem('token',response.token);
            navigate('/home',{ replace: true });
          }
          else
          {
            console.log(response);
          }
        }
      } catch (error) {
        let message=response.message;
        setError(message);
      }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-96 bg-white/10 backdrop-blur-lg shadow-2xl p-6 rounded-2xl"
      >
        <h2 className="text-2xl font-semibold text-center text-white mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit} >
          {!isLogin && (
            <div>
              <label className="block text-white">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={fullName}
                onChange={(e)=>setFullName(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          )}
          {!isLogin && (
            <div>
              <label className="block text-white">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e)=>setUserName(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          )}
          <div>
            <label className="block text-white">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-white">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button className="w-full p-2 mt-4 bg-white text-blue-600 rounded-lg hover:bg-blue-100 transition duration-200">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-white text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-300 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </motion.div>
    </div>
  );
}
