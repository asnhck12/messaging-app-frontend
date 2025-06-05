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
import closeIcon from "../../assets/images/closeicon.svg";
import addressBookIcon from "../../assets/images/addressbookicon.svg";
import chatIcon from "../../assets/images/chaticon.svg";
import menuIcon from "../../assets/images/menuicon.svg";

const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
    const [contactView, setContactView] = useState(false);
    const isLoggedIn = isAuthenticated();
    const [messageView, setMessageView] = useState(false);
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
    setImageFile,
    myConversations,
    fetchMyConversations,
    markConversationAsRead,
  } = useConversation();

    useSocketListeners({ conversationId, setMessages, setIsTyping, setOnlineUserIds, fetchMyConversations });

    const contactsList = () => {
        if (contactView) {setContactView(false)}
        else setContactView(true);
        }

        if (!isLoggedIn) return <Navigate to="/login" replace />

    
    const mobileView = () => {
      if (messageView) {
        setMessageView(false);
      } else if (!messageView) {
        setMessageView(true);
      }
    }


    return (
    <div className="mainSection">
      <div className={`sidePanel ${messageView ? '' : 'viewOn'}`}>
        <div className="sidePanelViewButton">
          <img src={closeIcon} onClick={mobileView} />
        </div>
        <div className="contactOrConversationsButton">
          <img onClick={contactsList} src={contactView ? chatIcon : addressBookIcon} />
        </div>
        {contactView ? (
          <UsersList
            setSelectedUser={setSelectedUser}
            groupName={groupName}
            setGroupName={setGroupName}
            onlineUserIds={onlineUserIds}
            setOnlineUserIds={setOnlineUserIds}
            mobileView={mobileView}
          />
        ) : (
          <ConversationsList
            setSelectedConversation={setSelectedConversation}
            setSelectedUser={setSelectedUser}
            setGroupName={setGroupName}
            mobileView={mobileView}
            myConversations={myConversations}
          />
        )}
      </div>
      <div className={`messageView ${messageView ? 'viewOn' : ''}`}>
        <div className="messagePanelViewButton">
          <img src={menuIcon} onClick={mobileView} />
        </div>
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
              conversationId={conversationId}
              markConversationAsRead={markConversationAsRead}
              fetchMyConversations={fetchMyConversations}
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
