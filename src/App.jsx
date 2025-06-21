import Header from './modules/Header/Header.jsx'
import Footer from './modules/Footer/Footer.jsx'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { isAuthenticated } from './auth/auth.js'
import { useEffect } from 'react'
import { fetchWithAuth } from './utils/api.js'
const API_URL = import.meta.env.VITE_API_URL;
import '@fontsource/fredoka'; // 400 by default
import '@fontsource/fredoka/700.css'; // optional bold
import '@fontsource/quicksand'; // 400 by default
import '@fontsource/quicksand/600.css'; // optional semi-bold

function App() {

  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [completedProfile, setCompletedProfile] = useState(false);

  useEffect(() => {
  const authenticateUsers = async () => {
    if (isAuthenticated()) {
      setLoggedIn(true);
      try {
        const res = await fetchWithAuth(`${API_URL}/profile/myProfile`);
        const data = await res.json();

        const profileIsComplete = !!data.firstName && !!data.surName;
        setCompletedProfile(profileIsComplete);
      } catch (error) {
        console.error("Error checking profile:", error);
        setCompletedProfile(false);
      }
    } else {
      setLoggedIn(false);
      setCompletedProfile(false); // ensure both are false when not authenticated
    }
  };

  authenticateUsers();
}, []);

  return (
    <>
    <div className='fullDisplay'>
      <Header setLoggedIn={setLoggedIn}  completedProfile= {completedProfile} />
      <Outlet context={{loggedInStatus: loggedIn, setLoggedInStatus: setLoggedIn, setCompletedProfile: setCompletedProfile}}/>
      <Footer/>
      </div>
    </>
  )
}

export default App;
