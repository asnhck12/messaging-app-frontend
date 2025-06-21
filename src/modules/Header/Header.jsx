import './Header.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../auth/auth';
import { fetchWithAuth } from '../../utils/api';
import signouticon from "../../assets/images/signouticon.svg";
import profileicon from "../../assets/images/profileicon.svg";
import socket from '../../utils/socket';
const API_URL = import.meta.env.VITE_API_URL;

function Header ({setLoggedIn, completedProfile }) {

    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetchWithAuth(`${API_URL}/users/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {

                localStorage.removeItem("token");
                socket.disconnect();
                navigate('/login');
                setLoggedIn(false);
                
            } else {
                console.error('Failed to logout:', response.status);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // console.log("profile is complete: ", profileComplete)

    const isLoggedIn = isAuthenticated();


    return (
        <>
    <div className="header">
        <div className="logo">
        <h1><Link to='/'>Natter</Link></h1>                   
            </div>
        <div className="navBar">
            {isLoggedIn ? (
                <>
                <div className={`updateProfile ${completedProfile ? "" : "profileIncomplete"}`}>
                    <Link to='update'>
                    <img src={profileicon} />
                    </Link>
                </div>
                    <div className="logoutButton">
                        <img src={signouticon} onClick={handleLogout}/>
                    </div>
                </>
            ) : null }
        </div>
    </div>
</>
    )
}

export default Header