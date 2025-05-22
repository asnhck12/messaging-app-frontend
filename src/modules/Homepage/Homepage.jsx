import { useState } from "react";
import './Homepage.css';
import UsersList from "./UsersList";
import { isAuthenticated } from "../../auth/auth";
import { Link, Navigate } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import useConversation from "../../hooks/useConversation";
import useSocketListeners from "../../hooks/useSockets";
import ChatHeader from "./ChatHeader";
import ChatView from "./ChatView";

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
    setSelectedConversation,
    groupName,
    setGroupName,
    onlineUserIds,
    setOnlineUserIds,
    isTyping,
    setIsTyping,
    emitTyping,
    handleSubmit,
    imageFile,
    setImageFile
  } = useConversation();

    useSocketListeners({ conversationId, setMessages, setIsTyping, setOnlineUserIds });

    const contactsList = () => {
        if (contactView) {setContactView(false)}
        else setContactView(true);
        }

        if (!isLoggedIn) return <Navigate to="/login" replace />


    return (
    <div className="mainSection">
      <div className="sidePanel">
        <button onClick={contactsList}>{contactView ? "Chats" : "Contacts"}</button>
        {contactView ? (
          <UsersList
            setSelectedUser={setSelectedUser}
            groupName={groupName}
            setGroupName={setGroupName}
            onlineUserIds={onlineUserIds}
            setOnlineUserIds={setOnlineUserIds}
          />
        ) : (
          <ConversationsList
            setSelectedConversation={setSelectedConversation}
            setSelectedUser={setSelectedUser}
            setGroupName={setGroupName}
          />
        )}
      </div>
      <div className="messageView">
        {conversationId ? (
          <>
            <ChatHeader
              groupName={groupName}
              selectedUser={selectedUser}
              onlineUserIds={onlineUserIds}
            />
            <ChatView
              messages={messages}
              isTyping={isTyping}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSubmit={handleSubmit}
              emitTyping={emitTyping}
              selectedUser={selectedUser}
              imageFile={imageFile}
              setImageFile={setImageFile}
            />
          </>
        ) : (
          <p>No user selected</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
