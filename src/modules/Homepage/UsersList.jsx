import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api";
const API_URL = import.meta.env.VITE_API_URL;

function UsersList({setSelectedUser}) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
            fetchUsers();
        }, []);

    const fetchUsers = async () => {
                try {
                    const response = await fetchWithAuth(`${API_URL}/users`);
                    const responseData = await response.json();
                    setUsers(responseData);
                } catch (error) {
                    console.log("Error fetching messages", error);
                }
            };

    return (
    <>
    <div>
    {users.map((user) => (
                <div key={user.id} className="userSection" onClick={() => setSelectedUser(user)}>
                    <p>{user.id} {user.username}</p>
                </div>
            ))}
    </div>
    </>
    )
}

export default UsersList;