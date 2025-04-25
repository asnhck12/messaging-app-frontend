import Header from './modules/Header/Header.jsx'
import Footer from './modules/Footer/Footer.jsx'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { isAuthenticated } from './auth/auth.js'
import { useEffect } from 'react'

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
