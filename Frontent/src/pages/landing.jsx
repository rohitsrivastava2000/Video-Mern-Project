import React from "react";
import "../App.css";
import { Link } from "react-router-dom";


function LandingPage() {
  return (
    <div className="landingPageContainer">
      <div className="flex justify-center items-center">
        <div className="flex justify-between items-center m-8 w-[80%]">
          <div>
            <h2 className="text-3xl font-bold text-white">Online Meet</h2>
          </div>
          <div className="flex justify-center items-center gap-3.5">
            <Link to='/login' >
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300">
              Login
            </button>
            </Link>

            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300">
              Join As Guest
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center h-[60%] p-16">
        <div className="text-white flex flex-col items-center text-center">
          <h1 className="text-8xl"><span className="text-orange-400" >Connect</span> With Your Friends</h1>
          <button className="bg-gradient-to-r mt-5 from-orange-500 via-red-500 to-purple-600 hover:from-orange-600 hover:via-red-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
