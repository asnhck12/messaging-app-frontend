import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api";
import socket, { connectSocket } from "../../utils/socket";
const API_URL = import.meta.env.VITE_API_URL;

function UsersList({setSelectedUser }) {
  const [users, setUsers] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [createGroup, setCreateGroup] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const groupSectionOpen = () => {
          setCreateGroup(true)
          }

            const groupSectionClose = () => {
          setCreateGroup(false)
          }

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
        
        const toggleUserSelection = (user) => {
          setSelectedUsers((prevSelected) => {
            const isSelected = prevSelected.some((u) => u.id === user.id);
            if (isSelected) {
              return prevSelected.filter((u) => u.id !== user.id);
            } else {
              return [...prevSelected, user];
            }
          });
        };
        
        const isUserSelected = (userId) =>
          selectedUsers.some((user) => user.id === userId);
        
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
        <div className="usersList">
          {!createGroup ? (
            <>
            <div className="groupCreateButton">
              <button onClick={groupSectionOpen}>Create Group</button>
              </div>
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
                </> ) : (
                  <>
                  <p>Group selection here</p>
                  <div>
                    {users.map((user) => (
                      <div
                      key={user.id}
                      className={`userSection ${isUserSelected(user.id) ? "selected" : ""}`}
                      onClick={() => toggleUserSelection(user)}
                      style={{
                        backgroundColor: isUserSelected(user.id) ? "#e0f7fa" : "transparent"
                      }}
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
                
                <div className="closeGroupCreateButton">
                    <button onClick={groupSectionClose}>Create</button>
                </div>
                <div className="closeGroupCreateButton">
                  <button onClick={groupSectionClose}>Cancel</button>
                  </div>


                </>
              )}
              </div> 
              
            )
            }
export default UsersList;