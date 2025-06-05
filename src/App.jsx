import Header from './modules/Header/Header.jsx'
import Footer from './modules/Footer/Footer.jsx'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { isAuthenticated } from './auth/auth.js'
import { useEffect } from 'react'
import '@fontsource/fredoka'; // 400 by default
import '@fontsource/fredoka/700.css'; // optional bold
import '@fontsource/quicksand'; // 400 by default
import '@fontsource/quicksand/600.css'; // optional semi-bold

function App() {

  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const authenticateUsers = async () => {
        if (isAuthenticated()) {
          setLoggedIn(true);
        }
        else if (!isAuthenticated) {
          setLoggedIn(false);
        }
        else {
          console.log("Error with the token")

        }
    };

    authenticateUsers();
}, []);

  return (
    <>
    <div className='fullDisplay'>
      <Header setLoggedIn={setLoggedIn}/>
      <Outlet context={{loggedInStatus: loggedIn, setLoggedInStatus: setLoggedIn}}/>
      <Footer/>
      </div>
    </>
  )
}

export default App;
