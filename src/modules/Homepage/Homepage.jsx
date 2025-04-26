import { useState, useEffect } from "react";
import './Homepage.css';
import { fetchWithAuth } from "../../utils/api";
import UsersList from "./UsersList";
import { isAuthenticated } from "../../auth/auth";
import { Navigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [conversationId, setConversationId] = useState("");

    useEffect(() => {
        if(selectedUser) {
            fetchConversation();
        }
    }, [selectedUser]);

    const fetchConversation = async () => {
        try {
            const response = await fetchWithAuth(`${API_URL}/conversations/findOrCreate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedUser: selectedUser.id })
            });
            const data = await response.json();
            setConversationId(data.conversation.id);
            fetchMessages(data.conversation.id);
        } catch (error) {
            console.error("Error fetching/creating conversation:", error);
        }
    }
    
    const fetchMessages = async (convId) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/messages/${convId}`);
            const responseData = await response.json();
            setMessages(responseData);
        } catch (error) {
            console.log("Error fetching messages", error);
        }};

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!conversationId) return;

        const newMessagePayload = {
            content: newMessage,
            conversationId: conversationId
        };

        try {
            const response = await fetchWithAuth(`${API_URL}/messages/newmessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMessagePayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("New message error from server:", errorData);
                throw new Error('Failed to submit message');
            }

            const result = await response.json();
            console.log('Message submitted successfully:', result);

            setNewMessage('');
            fetchMessages(conversationId);
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    const isLoggedIn = isAuthenticated();

    return (
        <>
        <div className="mainSection">
            {isLoggedIn ? (
                <>
                <div className="usersList">
                    <div className="usersList">
                        <UsersList setSelectedUser={setSelectedUser}/>
                    </div>
                </div>
                <div className="messageView">
                    {selectedUser ? ( 
                        <>
                        <div className="messageTitle">
                            <h2>{selectedUser.username}</h2>
                        </div>
                        <div className="chatView">
                            {messages.map((message) => (
                                <div key={message.id} className="messageSection">
                                    <p>{message.sender.username}: {message.content}</p>
                                </div>
                            ))}
                        <div>
                        <form onSubmit={handleSubmit}>
                            {/* <label htmlFor="newMessage">New Message</label> */}
                            <input type="text" name="newMessage" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} required/>
                            <button type="submit">Submit</button>            
                        </form>
                    </div>
                </div>
                </>
                ) : (
                <p> No users selected </p>)}
            </div> 
            </> ) : (
                <Navigate to="/login" replace />
            )}
        </div>
        </>
        )}

export default HomePage;