import { useState, useEffect } from "react";
import './Homepage.css';
import { fetchWithAuth } from "../../utils/api";
const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        fetchMessages();
    }, []);
            const fetchMessages = async () => {
            try {
                const response = await fetchWithAuth(`${API_URL}/messages`);
                const responseData = await response.json();
                setMessages(responseData);
            } catch (error) {
                console.log("Error fetching messages", error);
            }
        };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newMessagePayload = {
            content: newMessage
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

            fetchMessages();
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    return (
        <>
        <div className="mainSection">
            <div className="messages">
                <h1>Messages</h1>
                </div>
                <div className="mainContent">
                {messages.map((message) => (
                <div key={message.id} className="messageSection">
                    <p>{message.message}</p>
                </div>
            ))}
            <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newMessage">New Message</label>
                <input type="text" name="newMessage" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} required/>
                <button type="submit">Submit</button>            
            </form>
            </div>
                            </div>
                            </div>
        </>
    )}
export default HomePage;