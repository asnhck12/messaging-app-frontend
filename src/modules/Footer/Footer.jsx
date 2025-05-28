import icon from "/src/assets/images/github_icon.svg";
import './Footer.css';

function Footer () {
    return (
        <>
        <div className="footer">
        <div className="gitHubText">
            <p>asnhck12</p>
        </div>
        <div className="gitHubIcon">
            <img src={icon} />
        </div>
        </div>
        </>
    )
}

export default Footer