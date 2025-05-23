import React from "react";
const API_URL = import.meta.env.VITE_API_URL;

const ChatView = ({
  messages,
  selectedUser,
  isTyping,
  newMessage,
  setNewMessage,
  emitTyping,
  handleSubmit,
  imageFile,
  setImageFile
}) => {
  return (
    <div className="chatView">
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
          <p>
            {message.sender?.isDeleted ? "Deleted User" : message.sender?.username}:{" "}
            {message.content}
          </p>
          {message.imageUrl && (
      <img
        src={`${API_URL}${message.imageUrl}`}
        alt="sent media"
        style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "4px" }}
      />
    )}
        
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
    placeholder="Type a message"
  />

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setImageFile(e.target.files[0])}
  />

  <button type="submit" disabled={!newMessage && !imageFile}>
    Send
  </button>
</form>
    </div>
  );
};

export default ChatView;
