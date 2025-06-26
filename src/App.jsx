import Header from './modules/Header/Header.jsx'
import Footer from './modules/Footer/Footer.jsx'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { isAuthenticated } from './auth/auth.js'
import { useEffect } from 'react'
import { fetchWithAuth } from './utils/api.js'
const API_URL = import.meta.env.VITE_API_URL;
import '@fontsource/fredoka';
import '@fontsource/fredoka/700.css'; 
import '@fontsource/quicksand';
import '@fontsource/quicksand/600.css';

function App() {

  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [completedProfile, setCompletedProfile] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [username, setUsername] = useState(null);


  useEffect(() => {
  const authenticateUsers = async () => {
    if (isAuthenticated()) {
      setLoggedIn(true);
      try {
        const res = await fetchWithAuth(`${API_URL}/profile/myProfile`);
        const data = await res.json();

        const profileIsComplete = !!data.firstName && !!data.surName;
        const guestProfile = data.isGuest;
        const profileUsername = data.username;
        setCompletedProfile(profileIsComplete);
        setIsGuest(guestProfile);
        setUsername(profileUsername);
      } catch (error) {
        console.error("Error checking profile:", error);
        setCompletedProfile(false);
      }
    } else {
      setLoggedIn(false);
      setCompletedProfile(false);
      setIsGuest(false);
    }
  };

  authenticateUsers();
}, []);

  return (
    <>
    <div className='fullDisplay'>
      <Header setLoggedIn={setLoggedIn}  completedProfile= {completedProfile} isGuest={isGuest} username={username} />
      <Outlet context={{loggedInStatus: loggedIn, setLoggedInStatus: setLoggedIn, setCompletedProfile: setCompletedProfile, setIsGuest: setIsGuest,isGuest: isGuest}}/>
      <Footer/>
      </div>
    </>
  )
}

export default App;
