import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../context/context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { IconButton } from '@mui/material';
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from 'react-router-dom';

function HistoryPage() {
  const { getUserHistory } = useContext(MyContext);
  const [meetings, setMeetings] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getUserHistory();
        setMeetings(history);
      } catch (error) {
        console.error('Error fetching meeting history:', error);
        
      }
    };
    fetchHistory();
  }, []);

  return (
    <> 
      <IconButton onClick={()=>{navigate('/home')}} >
        <HomeIcon className='!text-4xl' />
      </IconButton>
      {meetings.length > 0 ? (
        meetings.map((meeting, index) => {
          return ( <Card key={meeting.meeting_id || index} sx={{ minWidth: 275, marginBottom: 2 }}>
            <CardContent>
              <h1>{`Meeting ID: ${meeting.meeting_id}`}</h1>
              <h3>{`Date: ${new Date(meeting.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}`}</h3>
              <h3>{`Time: ${new Date(meeting.createdAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}`}</h3>
            </CardContent>
          </Card>
        )})
      ) : (
        <p>No History Yet...</p>
      )}
    </>
  );
}

export default HistoryPage;
