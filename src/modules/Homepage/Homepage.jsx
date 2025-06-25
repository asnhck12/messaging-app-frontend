import './Homepage.css';
import UsersList from "./UsersList";
import { isAuthenticated } from "../../auth/auth";
import { Navigate, useOutletContext } from "react-router-dom";
import ConversationsList from "./ConversationsList";
import useConversation from "../../hooks/useConversation";
import useSocketListeners from "../../hooks/useSockets";
import ChatHeader from "./ChatHeader";
import ChatView from "./ChatView";
import addressBookIcon from "../../assets/images/addressbookicon.svg";
import chatIcon from "../../assets/images/chaticon.svg";

const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
    const isLoggedIn = isAuthenticated();
      const {
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    selectedUser,
    setSelectedUser,
    conversationId,
    setConversationId,
    setSelectedConversation,
    setContactView,
    contactView,
    selectedConversation,
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
    handleCreateGroup,
    messageView,
    setMessageView,
    fetchConversation
  } = useConversation();
  
  const { isGuest } = useOutletContext();


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
        <div className="contactOrConversationsButton">
          <img onClick={contactsList} src={contactView ? chatIcon : addressBookIcon} />
        </div>
        {contactView ? (
          <>
          <h2 className="listHeading">Users</h2>
          <UsersList
            setSelectedUser={setSelectedUser}
            setGroupName={setGroupName}
            onlineUserIds={onlineUserIds}
            setOnlineUserIds={setOnlineUserIds}
            mobileView={mobileView}
            handleCreateGroup={handleCreateGroup}
            fetchConversation={fetchConversation}
            selectedUser={selectedUser}
            setSelectedConversation={setSelectedConversation}
            setMessages={setMessages}
            setConversationId={setConversationId}
          />
          </>
        ) : (
          <>
          <h2 className="listHeading">Chats</h2>
          <ConversationsList
            setSelectedConversation={setSelectedConversation}
            setSelectedUser={setSelectedUser}
            selectedConversation={selectedConversation}
            setGroupName={setGroupName}
            onlineUserIds={onlineUserIds}
            mobileView={mobileView}
            myConversations={myConversations}
          />
          </>
        )}
      </div>
      <div className={`messageView ${messageView ? 'viewOn' : ''}`}>
        {(selectedUser?.length > 0 || selectedConversation) ? (
          <>
            <ChatHeader
              groupName={groupName}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              onlineUserIds={onlineUserIds}
              mobileView={mobileView}
              setSelectedConversation={setSelectedConversation}
              isGuest={isGuest}

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
          <p>No conversation selected</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
