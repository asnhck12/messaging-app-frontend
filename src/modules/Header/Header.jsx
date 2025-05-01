import './Header.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../auth/auth';
import { fetchWithAuth } from '../../utils/api';
const API_URL = import.meta.env.VITE_API_URL;

function Header ({setLoggedIn}) {
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
                navigate('/login');
                setLoggedIn(false);
                
            } else {
                console.error('Failed to logout:', response.status);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const isLoggedIn = isAuthenticated();


    return (
        <>
    <div className="header">
        <div className="logo">
        <h1><Link to='/'>Messijme</Link></h1>                   
            </div>
        <div className="navBar">
            {isLoggedIn ? (
                <>
                <div className='updateProfile'>
                    <Link to='update'>My Profile</Link>
                </div>
                    <div className="logoutButton">
                        <a href="#" onClick={handleLogout}>Logout</a>
                    </div>
                </>
            ) : (
                <>
                    <div className="signupButton">
                        <Link to='signup'>Signup</Link>
                    </div>
                </>
            )}
        </div>
    </div>
</>
    )
}

export default Header