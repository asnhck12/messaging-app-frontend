import { useState, useEffect } from "react";
import './Homepage.css';
// import { fetchWithAuth } from "../../utils/api";
import UsersList from "./UsersList";
import { isAuthenticated } from "../../auth/auth";
import { Link, Navigate } from "react-router-dom";
import socket, { connectSocket } from "../../utils/socket";
import ConversationsList from "./ConversationsList";
import useConversation from "../../hooks/useConversation";
// import useSocketListeners from "../../hooks/useSockets";

const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
    const [contactView, setContactView] = useState(false);
    const isLoggedIn = isAuthenticated();
      const {
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    selectedUser,
    setSelectedUser,
    conversationId,
    // selectedConversation,
    setSelectedConversation,
    groupName,
    setGroupName,
    onlineUserIds,
    setOnlineUserIds,
    isTyping,
    setIsTyping,
    emitTyping,
    handleSubmit
  } = useConversation();

    useEffect(() => {
        connectSocket(), [];

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
              const handleOnlineUsers = ({ userIds }) => {
                const newOnlineUsers = new Set(userIds);
                setOnlineUserIds(newOnlineUsers);
                console.log("Online user IDs: ", newOnlineUsers)
              };
              
              socket.on("online_users", handleOnlineUsers);
              
              return () => {
                socket.off("online_users", handleOnlineUsers);
              };
            }, []);
    
    const contactsList = () => {
        if (contactView) {setContactView(false)}
        else setContactView(true);
        }

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

        const handleIncomingTyping = () => {
            // if (typingConvId === conversationIdRef.current) {
                setIsTyping(true);
            // }
        };

        const handleStopIncomingTyping = () => {
            // if (typingConvId === conversationIdRef.current) {
                setIsTyping(false);
            // }
        };

        socket.on("set_typing", handleIncomingTyping);
        socket.on("set_stop_typing", handleStopIncomingTyping);

        return () => {
            socket.off("set_typing", handleIncomingTyping);
            socket.off("set_stop_typing", handleStopIncomingTyping);
        };
    }, [conversationId]);

    return (
  <div className="mainSection">
    {isLoggedIn ? (
      <>
        <div className="sidePanel">
          {contactView ? (
            <>
              <button onClick={contactsList}>Chats</button>
              <div className="usersList">
                <UsersList 
                setSelectedUser={setSelectedUser} 
                groupName={groupName}
                setGroupName={setGroupName}
                setOnlineUserIds={setOnlineUserIds}
                onlineUserIds={onlineUserIds}
                />
              </div>
            </>
          ) : (
            <>
              <button onClick={contactsList}>Contacts</button>
              <div className="conversationsList">
                <ConversationsList
                  setSelectedConversation={setSelectedConversation}
                  setSelectedUser={setSelectedUser}
                  setGroupName={setGroupName}
                />
              </div>
            </>
          )}
        </div>

        <div className="messageView">
          {conversationId ? (
            <>
              <div className="messageTitle">
                {groupName && (
                    <h3>{groupName}</h3>
                    )}
                    {selectedUser.map((user, index) => (
                        <span key={user.id}>
                            <Link to={`/profile/${user.id}`}>{user.username}</Link>
                            <span style={{ color: onlineUserIds.has(user.id) ? "green" : "gray" }}>
                        ● {onlineUserIds.has(user.id) ? "Online" : "Offline"}
                      </span>
                            {index < selectedUser.length - 1 && ', '}
                        </span>
                    ))}
                    </div>

              <div className="chatView">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      "messageSection " +
                      (selectedUser.some(
                        (user) => user.username === message.sender.username
                      )
                        ? "recipient"
                        : "sender")
                    }
                  >
                    <p>
                      {message.sender.username}: {message.content}
                    </p>
                  </div>
                ))}

                {isTyping && (
                  <p className="typing-indicator">
                    {selectedUser[0]?.username} is typing...
                  </p>
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
