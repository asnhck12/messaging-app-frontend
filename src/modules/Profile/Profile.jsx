import {  useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api";
import { useParams } from "react-router-dom";
import profileicon from "../../assets/images/profileiconblack.svg";
import './Profile.css';
const API_URL = import.meta.env.VITE_API_URL;


function Profile() {
    const {userId} = useParams();
    const[username,setUsername] = useState("");
    const[firstName,setFirstName] = useState("");
    const[surName,setSurName] = useState("");
    const[summary,setSummary] = useState("");

    useEffect(() => {
            if(userId) {
                fetchProfile(userId);
            }
        }, [userId]);
    
         const fetchProfile = async (userId) => {
                try {
                    const response = await fetchWithAuth(`${API_URL}/profile/users/${userId}`);
                    const responseData = await response.json();
                setFirstName(responseData.firstName);
                setSurName(responseData.surName);
                setSummary(responseData.profileSummary);
                setUsername(responseData.user.username);

            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }

    return (
        <>
        <div className="mainProfileSection">
            <div className="profileCard">
                <div className="profileIconContainer">
                    <div className="profileIcon">
                        <img src={profileicon}/>
                    </div>
                </div>
                <div className="profileUsername">
                    <div className="userNameFieldSection">
                        <p className="usernameField">{username}</p>
                    </div>
                </div>
            </div>
            {(!firstName && !surName && !summary) ? (
                <div className="missingBioInfoSection">
                    <p className="missingBioInfo">This user has not completed their bio!</p>
                </div>
                ) : (
                <>
                <div className="profileDetails">
                    <div className="profileFirstName">
                        <p className="fieldLabel">First Name</p>
                        <p className="fieldLabelDetail">{firstName}</p>
                    </div>    
                    <div className="profileSurName">
                        <p className="fieldLabel">Surname</p>
                        <p className="fieldLabelDetail">{surName}</p>
                    </div>
                    <div className="profileSummary">
                        <p className="fieldLabel">About me</p>
                        <p className="fieldLabelDetail">{summary}</p> 
                    </div>
                </div>
                </>
                )
                }
        </div>
        </>
    )
}

export default Profile;