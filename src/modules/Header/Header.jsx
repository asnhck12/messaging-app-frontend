import './Header.css';
const API_URL = import.meta.env.VITE_API_URL;

function Header () {

    return (
        <>
    <div className="header">
        <div className="logo">
                <h1>Messijme</h1>                   
            </div>
        <div className="navBar">
            <div className="homeButton">
                <h1>Home</h1>
            </div>
                <>
                    <div className="loginButton">
                        <h1>Login</h1>
                    </div>
                    <div className="signupButton">
                        <h1>Signup</h1>
                    </div>
                </>
        </div>
    </div>
</>

    )
}

export default Header