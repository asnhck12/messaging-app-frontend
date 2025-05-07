import { useState, useEffect } from "react";
import './Homepage.css';
import { fetchWithAuth } from "../../utils/api";
import UsersList from "./UsersList";
import { isAuthenticated } from "../../auth/auth";
import { Link, Navigate } from "react-router-dom";
import socket from "../../utils/socket";
const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [conversationId, setConversationId] = useState("");

    const isLoggedIn = isAuthenticated();

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

        useEffect(() => {
            if(!conversationId) return;

            socket.emit("join_conversation", conversationId);

            console.log("Connected to server");
    
            const handleIncomingMessage = (msg) => {
                console.log("Received message", msg);

                if (msg.conversationId === conversationId) {
                    console.log(`received: ${msg}`);
                    setMessages((prev) => [...prev, msg]);
                }
            };
            socket.on("connect", () => {
                console.log("Connected to server");
            });
            socket.on("receive_message", handleIncomingMessage);
            socket.on("disconnect",() => {
                console.log("Disnnected from server");
            });;
    
        return () => { 
            socket.emit("leave_conversation", conversationId);
            socket.off("connect");
            socket.off("receive_message", handleIncomingMessage);
            socket.off("disconnect");
        };
    }, [conversationId]);

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
                throw new Error('Failed to submit message');
            }

            setNewMessage('');
        } catch (error) {
            console.error('Error submitting message:', error);
        }
    };

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
                        <Link to={`/profile/${selectedUser.id}`}><h2>{selectedUser.username} {selectedUser.id}</h2></Link> 
                        </div>
                        <div className="chatView">
                            {messages.map((message) => (
                                <div key={message.id} className={"messageSection " + (message.sender.username === selectedUser.username ? 'recipient' : 'sender')}>
                                    <p>{message.sender.username}: {message.content}</p>
                                </div>
                            ))}
                        <div>
                        <form onSubmit={handleSubmit}>
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