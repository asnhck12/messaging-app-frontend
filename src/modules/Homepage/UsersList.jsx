import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api";
import addgroupicon from '../../assets/images/newgroupicon.svg';
import profileicon from "../../assets/images/profileicon.svg";

const API_URL = import.meta.env.VITE_API_URL;

function UsersList({setSelectedUser, onlineUserIds, mobileView, handleCreateGroup, fetchConversation, setSelectedConversation, setMessages, setConversationId, createGroupError }) {
  const [users, setUsers] = useState([]);
  const [createGroup, setCreateGroup] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupNameInput, setGroupNameInput] = useState("");
  

  const groupSectionOpen = () => {
          setCreateGroup(true)
          }

            const groupSectionClose = () => {
          setCreateGroup(false)
          }

    useEffect(() => {
            fetchUsers();
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
              <img src= {addgroupicon} onClick = {groupSectionOpen}/>
              </div>
              <div className="users">
                {users.slice().sort((a, b) => {
                  const aOnline = onlineUserIds.has(a.id);
                  const bOnline = onlineUserIds.has(b.id);
                  if (aOnline !== bOnline) return bOnline - aOnline;
                  return a.username.toLowerCase().localeCompare(b.username.toLowerCase());
                }).map((user) => (
                <div
                key={user.id}
                className="userSection"
                onClick={async () => {
                   const selected = [user];
                   
                   setSelectedUser([]);
                   setSelectedConversation("");
                   setMessages([]);
                   
                   setSelectedUser(selected);
                   
                   const convoId = await fetchConversation({ selectedUser: selected });
                   
                   if (!convoId) {
                    setConversationId("");
                    setMessages([]);
  }
                  mobileView();
}}
                  >
                    <div className="user">
                    <div className={`participantsIconUsers ${onlineUserIds.has(user.id) ? "userOnline" : "userOffline"}`}>
                      <img src={profileicon}/>
                    </div>
                    <div className="userDetails">
                      <p>{user.username}</p>
                      </div>
                      </div>
                    </div>
                ))}
                </div>
                </> ) : (
                  <>
                  <div className="createGroupSection">
                    <div className="createGroupHeader">
                      <p>Create Group</p>
                    </div>
                    <div className="groupNameSection">
                      <label htmlFor="groupName">Group Name</label>
                      <input
                      type="text"
                      id="groupName"
                      value={groupNameInput}
                      onChange={(e) => setGroupNameInput(e.target.value)}
                      required
                      />
                    </div>
                    <div className="errorMessageContainer">
                      {createGroupError && <p className="error-message">{createGroupError}</p>}
                    </div>
                  </div>
                  <div className="guestAddList">
                    {users.slice().sort((a, b) => {
                      const aOnline = onlineUserIds.has(a.id);
                      const bOnline = onlineUserIds.has(b.id);
                      if (aOnline !== bOnline) return bOnline - aOnline;
                      return a.username.toLowerCase().localeCompare(b.username.toLowerCase());}).map((user) => (
                      <div
                      key={user.id}
                      className={`userSection ${isUserSelected(user.id) ? "selected" : ""}`}
                      onClick={() => toggleUserSelection(user)}
                      >
                        <div className="user">
                          <div className={`participantsIconUsers ${onlineUserIds.has(user.id) ? "userOnline" : "userOffline"}`}>
                            <img src={profileicon}/>
                          </div>
                          <div className="userDetails">
                            <p>{user.username}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="groupButtons">
                    <div className="closeGroupCreateButton">
                      <button onClick={() => {
                        const success = handleCreateGroup(selectedUsers, groupNameInput);
                          if (success) {
                            mobileView();
                            groupSectionClose();
                          }
                        }}>Create</button>
                    </div>
                    <div className="closeGroupCreateButton">
                        <button onClick={groupSectionClose}>Cancel</button>
                    </div>
                  </div>
                </>
              )}
              </div> 
              
            )
            }
export default UsersList;