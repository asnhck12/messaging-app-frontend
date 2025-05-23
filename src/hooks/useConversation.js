import { useState, useEffect, useRef } from "react";
import { fetchWithAuth } from "../utils/api";
import socket, { connectSocket } from "../utils/socket";

const API_URL = import.meta.env.VITE_API_URL;

const useConversation = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [selectedConversation, setSelectedConversation] = useState("");
  const [groupName, setGroupName] = useState("");
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [isTyping, setIsTyping] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const typingTimeOutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectSocket();
    }
  }, []);

  useEffect(() => {
    if (selectedUser.length > 0) {
      fetchConversation({ selectedUser, groupName });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedConversation) {
      fetchConversation({ selectedConversation });
    }
  }, [selectedConversation]);

  const emitTyping = () => {
    if (!conversationId || !socket.connected) return;

    socket.emit("typing", { conversationId });

    if (typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current);

    typingTimeOutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { conversationId });
    }, 2000);
  };

  const fetchConversation = async ({ selectedUser, selectedConversation, groupName }) => {
    try {
      if (selectedUser?.length > 0) {
        const response = await fetchWithAuth(`${API_URL}/conversations/findOrCreate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedUser: selectedUser.map((user) => user.id),
            groupName: groupName || null,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch or create conversation.");

        const data = await response.json();
        const conversationId = data.conversation?.id;

        if (conversationId) {
          setConversationId(conversationId);
          fetchMessages(conversationId);
          setGroupName(data.conversation?.name || "");
        } else {
          throw new Error("Conversation ID missing in response.");
        }
      } else if (selectedConversation) {
        setConversationId(selectedConversation);
        fetchMessages(selectedConversation);
      } else {
        throw new Error("No selected user or conversation ID provided.");
      }
    } catch (error) {
      console.error("Error fetching/creating conversation:", error);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/messages/${convId}`);
      const responseData = await response.json();

      const messages = responseData.map(msg => ({
      ...msg,
        sender: msg.sender
          ? {
              ...msg.sender,
              username: msg.sender.isDeleted ? "Deleted User" : msg.sender.username,
            }
          : { username: "Deleted User", id: null }
    }));
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!conversationId) return;

    const formData = new FormData();
    formData.append("conversationId", conversationId);
    if (newMessage) formData.append("content", newMessage);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await fetchWithAuth(`${API_URL}/messages/newmessage`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit message");

      setNewMessage("");
      setImageFile(null);
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  return {
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    selectedUser,
    setSelectedUser,
    conversationId,
    selectedConversation,
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
  };
};

export default useConversation;
