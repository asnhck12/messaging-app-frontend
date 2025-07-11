import { useNavigate, useOutletContext } from "react-router-dom";
import useConversation from "../../hooks/useConversation";
import { fetchWithAuth } from "../../utils/api";
import './UpdateProfile.css';

const API_URL = import.meta.env.VITE_API_URL;

function UpdateProfile() {
const {
    firstName,
    setFirstName,
    surName, 
    setSurName,
    summary, 
    setSummary
  } = useConversation();

    const {setCompletedProfile, isGuest } = useOutletContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const profileUpdate = {
            firstname: firstName,
            surname: surName,
            summary: summary
        };
        try {
        const response = await fetchWithAuth(`${API_URL}/profile/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileUpdate)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Update error from server:", errorData);
            throw new Error('Failed to update profile');
        }

        setCompletedProfile(true);
        navigate('/');
}
        catch (error) {
            console.log('Error submitting updates: ', error);
        }
};

    return(
        <> 
        {isGuest ? (
            <div className="guestProfile">
                <p>Sign up for an account to create a Profile</p>
            </div>
        ) : (
        <div className="mainUpdateSection">
            <form method="post" onSubmit={handleSubmit}>
                <label htmlFor="firstname">First Name</label>
                <input type="text" name="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>                
                <label htmlFor="surname">Surname</label>
                <input type="text" name="surname" value={surName} onChange={(e) => setSurName(e.target.value)} required/>
                <label htmlFor="summary">About Me</label>
                <textarea name="summary" value={summary} onChange={(e) => setSummary(e.target.value)} required/>
                <button type="submit">Update</button>
            </form>
        </div> )}
        
        </>
    )
}

export default UpdateProfile