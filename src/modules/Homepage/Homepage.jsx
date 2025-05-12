import { useState, useEffect, useRef } from "react";
import './Homepage.css';
import { fetchWithAuth } from "../../utils/api";
import UsersList from "./UsersList";
import { isAuthenticated } from "../../auth/auth";
import { Link, Navigate } from "react-router-dom";
import socket, { connectSocket } from "../../utils/socket";

const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [conversationId, setConversationId] = useState("");
    const [isTyping, setIsTyping] = useState(null);
    const typingTimeOutRef = useRef(null);
    const conversationIdRef = useRef(conversationId);

    const isLoggedIn = isAuthenticated();

    useEffect(() => {
        connectSocket();

        const handleConnect = () => {
            console.log("Connected to server");
        };
        const handleDisconnect = () => {
            console.log("Disconnected from server");
        };
        const handleConnectError = (err) => {
            console.error("Connection error:", err.message);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
        };
    }, []);

    useEffect(() => {
        conversationIdRef.current = conversationId;
    }, [conversationId]);

    useEffect(() => {
        if (selectedUser) {
            fetchConversation();
        }
    }, [selectedUser]);

    const emitTyping = () => {
        if (!conversationId || !socket.connected) return;

        socket.emit("typing", { conversationId });

        if (typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current);

        typingTimeOutRef.current = setTimeout(() => {
            socket.emit("stop_typing", { conversationId });
        }, 2000);
    };

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
    };

    const fetchMessages = async (convId) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/messages/${convId}`);
            const responseData = await response.json();
            setMessages(responseData);
        } catch (error) {
            console.log("Error fetching messages", error);
        }
    };

    useEffect(() => {
        if (!conversationId || !socket.connected) return;

        socket.emit("join_conversation", conversationId);

        const handleIncomingMessage = (msg) => {
            if (msg.conversationId === conversationId) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("receive_message", handleIncomingMessage);

        return () => {
            socket.emit("leave_conversation", conversationId);
            socket.off("receive_message", handleIncomingMessage);
        };
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId || !socket.connected) return;

        const handleIncomingTyping = ({ conversationId: typingConvId }) => {
            if (typingConvId === conversationIdRef.current) {
                setIsTyping(true);
            }
        };

        const handleStopIncomingTyping = ({ conversationId: typingConvId }) => {
            if (typingConvId === conversationIdRef.current) {
                setIsTyping(false);
            }
        };

        socket.on("set_typing", handleIncomingTyping);
        socket.on("set_stop_typing", handleStopIncomingTyping);

        return () => {
            socket.off("set_typing", handleIncomingTyping);
            socket.off("set_stop_typing", handleStopIncomingTyping);
        };
    }, [conversationId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!conversationId) return;

        const newMessagePayload = {
            content: newMessage,
            conversationId
        };

        try {
            const response = await fetchWithAuth(`${API_URL}/messages/newmessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        <div className="mainSection">
            {isLoggedIn ? (
                <>
                    <div className="usersList">
                        <UsersList setSelectedUser={setSelectedUser} />
                    </div>
                    <div className="messageView">
                        {selectedUser ? (
                            <>
                                <div className="messageTitle">
                                    <Link to={`/profile/${selectedUser.id}`}>
                                        <h2>{selectedUser.username} {selectedUser.id}</h2>
                                    </Link>
                                </div>
                                <div className="chatView">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={"messageSection " + (message.sender.username === selectedUser.username ? 'recipient' : 'sender')}
                                        >
                                            <p>{message.sender.username}: {message.content}</p>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <p className="typing-indicator">{selectedUser.username} is typing...</p>
                                    )}
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            type="text"
                                            name="newMessage"
                                            value={newMessage}
                                            onChange={(e) => {
                                                setNewMessage(e.target.value);
                                                emitTyping();
                                            }}
                                            required
                                        />
                                        <button type="submit">Submit</button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <p>No user selected</p>
                        )}
                    </div>
                </>
            ) : (
                <Navigate to="/login" replace />
            )}
        </div>
    );
}

export default HomePage;
