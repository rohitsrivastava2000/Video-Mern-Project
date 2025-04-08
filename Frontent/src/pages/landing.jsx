import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [buttonVisible, setButtonVisible] = useState(true);

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    token ? navigate("/home") : navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setButtonVisible(!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6 border-b border-gray-700">
        <h2 className="text-3xl font-extrabold text-white">Online Meet</h2>
        <div className="flex items-center gap-4">
          {buttonVisible ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setButtonVisible(true);
                navigate("/");
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300"
            >
              Sign Out
            </button>
          )}
          <button
            onClick={() => navigate("/guest-room")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300"
          >
            Join as Guest
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 py-20 lg:py-36">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
          <span className="text-orange-500">Connect</span> with your friends
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-2xl">
          Fast, secure, and seamless video meetings — right from your browser.
        </p>

        <button
          onClick={handleGetStarted}
          className="mt-8 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300"
        >
          Get Started
        </button>
      </main>

      {/* Optional footer */}
      <footer className="text-center text-sm text-gray-400 py-6">
        © {new Date().getFullYear()} Online Meet. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
