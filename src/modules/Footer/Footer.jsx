import icon from "/src/assets/images/github_icon.svg";
import './Footer.css';

function Footer () {
    return (
        <>
        <div className="footer">
            <div className="gitHubSection">
                <div className="gitHubText">
                    <p>asnhck12</p>
                </div>
                <a href="https://github.com/asnhck12" 
                target="_blank" 
                rel="noopener noreferrer">
                    <div className="gitHubIcon">
                        <img src={icon} alt="GitHub" />
                    </div>
                </a>
            </div>
        </div>
        </>
    )
}

export default Footer