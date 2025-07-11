import React, { useEffect, useRef, useState }  from "react";
const API_URL = import.meta.env.VITE_API_URL;
import sendIcon from "../../assets/images/sendicon.svg";
import attachIcon from "../../assets/images/attachicon.svg";
import attachedIcon from "../../assets/images/attachedicon.svg";

const ChatView = ({
  messages,
  selectedUser,
  isTyping,
  newMessage,
  setNewMessage,
  emitTyping,
  handleSubmit,
  imageFile,
  setImageFile,
  conversationId,
  markConversationAsRead,
  fetchMyConversations
}) => {
  const bottomRef = useRef(null);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chatView">
      <div className="chatMessagesView">
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            "messageSection " +
            (selectedUser.some(user => user.username === message.sender?.username)
            ? "recipient"
            : "sender")
          }
        >
          <div className="messageBubble">
          <p className="chatUserName">
            {message.sender?.isDeleted ? "Deleted User" : message.sender?.username}
          </p>
          <p>
            {message.content}
          </p>
          {message.imageUrl && (
            <div className="chatImgContainer">
              <img
              src={`${API_URL}${message.imageUrl}`}
              alt="sent media"
              style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "4px", cursor: "pointer" }}
              onClick={() => setModalImageUrl(`${API_URL}${message.imageUrl}`)}
              />
            </div>
          )}
      </div>
      </div>
      ))}

      <div ref={bottomRef} />
      </div>

      {isTyping && (
        <p className="typing-indicator">
          {selectedUser[0]?.username} is typing...
        </p>
      )}
  <div className="messageSubmission">
      <form onSubmit={handleSubmit}>
  <input
    type="text"
    name="newMessage"
    value={newMessage}
    onChange={(e) => {
      setNewMessage(e.target.value);
      emitTyping();
    }}
    onFocus={async () => {
  if (conversationId && markConversationAsRead) {
    await markConversationAsRead(conversationId);
    if (fetchMyConversations) {
      fetchMyConversations();
    }
  }
}}
    placeholder="Type a message"
  />

    <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
      <img src={imageFile ? attachedIcon : attachIcon} />
    </label>
  <input
    id="fileInput"
    type="file"
    accept="image/*"
    onChange={(e) => setImageFile(e.target.files[0])}
    style={{display: 'none'}}
  />

  <button type="submit" disabled={!newMessage && !imageFile} style={{ background: 'none', border: 'none', padding: 0 }}>
  <img src={sendIcon} style={{ cursor: 'pointer' }} />
</button>
</form>
</div>
{modalImageUrl && (
  <div className="modalImage"
    onClick={() => setModalImageUrl(null)}
  >
    <img
      src={modalImageUrl}
      alt="enlarged"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}
    </div>
  
);
  
};

export default ChatView;
