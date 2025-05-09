import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api";
import socket, { connectSocket } from "../../utils/socket";
const API_URL = import.meta.env.VITE_API_URL;

function UsersList({setSelectedUser}) {
    const [users, setUsers] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());

    useEffect(() => {
            fetchUsers();
        }, []);
        
        useEffect(() => {
            connectSocket();
          }, []);


        useEffect(() => {
  const handleOnlineUsers = ({ userIds }) => {
    setOnlineUserIds(new Set(userIds));
  };

  socket.on("online_users", handleOnlineUsers);

  return () => {
    socket.off("online_users", handleOnlineUsers);
  };
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
                <div>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="userSection"
                      onClick={() => setSelectedUser(user)}
                    >
                      <p>
                        {user.id} {user.username}{" "}
                        <span style={{ color: onlineUserIds.has(user.id) ? "green" : "gray" }}>
                          ● {onlineUserIds.has(user.id) ? "Online" : "Offline"}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              );
            }
export default UsersList;