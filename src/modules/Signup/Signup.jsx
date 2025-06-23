import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import './Signup.css';
const API_URL = import.meta.env.VITE_API_URL;


function SignupPage () {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const signUpData = {
            username: username,
            password: password,
            confirm_password: confirmPassword
        };

        try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup error from server:", errorData);

        if (errorData.errors && errorData.errors.length > 0) {
          setErrorMessage(errorData.errors[0].msg);
        } else if (errorData.message) {
          setErrorMessage(errorData.message);
        } else {
          setErrorMessage("Signup failed. Please try again.");
        }
        return;
      }

            const result = await response.json();
            console.log('Sign up submitted successfully:', result);

            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setErrorMessage('');


            navigate('/login');
        } catch (error) {
            console.error('Error submitting signup:', error);
        }
    };
        
    
    return (
    <>
    <div className="mainSignupSection">
        <form method="post"  onSubmit={handleSubmit}>
            <div className='signupForm'>                
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>                
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <label htmlFor="confirm_password">Confirm Password</label>
                <input type="password" name="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                {errorMessage && (
                    <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                {errorMessage}
              </div>
            )}
            <div className="signupPageButtons">
                <button type="submit">Sign Up</button>
                <button onClick={() => navigate('/')}>
                    Back
                </button>
            </div>
            </div>
        </form>
    </div>
    </>
    )
}

export default SignupPage