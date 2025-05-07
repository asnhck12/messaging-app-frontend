import {  useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api";
import { useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;


function Profile() {
    const {userId} = useParams();
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

            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }

    return (
        <>
        <div className="mainProfileSection">
            <div className="profileIcon">
                <img/>
            </div>
                <div className="profileView">
                    <p>User: {userId}</p>
                    <p>First Name:{firstName}</p>
                    <p>Surname: {surName}</p>
                    <p>About me: {summary}</p>
                </div>
        </div>
            </>
    )
}

export default Profile;