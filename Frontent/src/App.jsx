import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router ,Routes ,Route} from 'react-router-dom'
import LandingPage from './pages/landing'
import  Registration from './pages/registration'
import { MyContext} from './context/context.jsx'
import VideoMeet from './pages/videoMeet.jsx'
import HomeComponent from './pages/home.jsx'
import HistoryPage from './pages/history.jsx'

function App() {
  

  return (
    <>
      <Router>        
        <Routes>
          <Route path='/' element={<LandingPage/>} />     
          <Route path='/login' element={<Registration/>} />      
          <Route path='/home' element={<HomeComponent />} />
          <Route path='/history' element={<HistoryPage />} /> 
          
          <Route path='/:url' element={<VideoMeet/>} />
        </Routes>
        
      </Router>
    </>
  )
}

export default App
