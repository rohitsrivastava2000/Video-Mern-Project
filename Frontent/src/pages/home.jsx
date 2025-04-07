import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../context/context';

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
 const {addUserHistory}=useContext(MyContext)

  let handleJoinVideoCall = async () => {
    console.log("handleJoinVideoCall")
   await addUserHistory(meetingCode)
    
    navigate(`/${meetingCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        <h2 className="text-3xl font-bold text-gray-800">Video Meet Call</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <IconButton>
              <RestoreIcon className="text-gray-700" />
            </IconButton>
            <p onClick={()=>navigate('/history')} className="text-lg cursor-pointer font-medium">History</p>
          </div>
          <Button
            className="!text-lg"
            variant="contained"
            color="primary"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-between items-center p-6 flex-grow">
        {/* Left Side */}
        <div className="flex flex-col justify-center items-start bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Providing Quality Video Calls
          </h2>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter Meeting Code"
            onChange={(e) => setMeetingCode(e.target.value)}
            value={meetingCode}
            className="mb-4"
          />
          <Button
            onClick={handleJoinVideoCall}
            variant="contained"
            color="primary"
            fullWidth
          >
            Join Meeting
          </Button>
        </div>

        {/* Right Side */}
        <div className="flex justify-center items-center mt-6 lg:mt-0">
          <img src="/logo.png" width={600} height={600} alt="Meeting Logo" className="rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
