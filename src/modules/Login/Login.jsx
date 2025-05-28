import { useState } from "react";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import socket from "../../utils/socket";
const API_URL = import.meta.env.VITE_API_URL;

function LoginPage () {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); 

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = {
            username: username,
            password: password
        };

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                const result = await response.json();
                if (result.message === "User account has been deleted") {
                    setErrorMessage("This account has been deleted. Please contact support or create a new account.");
                } else {
                    setErrorMessage(result.message || "Failed to log in.");
    }
    return;
}

            const result = await response.json();

            localStorage.setItem('token', result.token);

            socket.auth = { token: result.token };
            socket.connect(); 

            setUsername('');
            setPassword('');
            setErrorMessage('');

            navigate('/');
            
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    const handleGuestLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/users/guestLogin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (!response.ok) {
                setErrorMessage(result.message || 'Failed to login as guest');
                return;
            }

            localStorage.setItem('token', result.token);
            socket.auth = { token: result.token };
            socket.connect();
            navigate('/');
        } catch (error) {
            console.error("Guest login error:", error);
            setErrorMessage("Guest login failed");
        }
    };

    return (
    <>
    <div className="mainLoginSection">
        <form method="post" onSubmit={handleSubmit}>
            <div className='loginForm'>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} required/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} required/>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Login</button>
                <button onClick={() => navigate('/signup')}>
                    Signup
                </button>
                <button onClick={handleGuestLogin}>
                        Continue as Guest
                    </button>
            </div>
        </form>
    </div>
    </>
    )
}

export default LoginPage