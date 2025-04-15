import Header from './modules/Header/Header.jsx'
import Footer from './modules/Footer/Footer.jsx'
import './App.css'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
    <div className='fullDisplay'>
      <Header/>
      <Outlet/>
      <Footer/>
      </div>
    </>
  )
}

export default App;
