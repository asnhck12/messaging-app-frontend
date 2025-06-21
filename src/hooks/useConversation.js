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
  const [myConversations, setMyConversations] = useState([]);
  const [messageView, setMessageView] = useState(true);
  const [contactView, setContactView] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [summary, setSummary] = useState("");
  const [profileComplete, setProfileComplete] = useState(false);
  
  useEffect(() => {
      const fetchMyProfile = async () => {
        try {
          const response = await fetchWithAuth(`${API_URL}/profile/myProfile`);
          const data = await response.json();
          const first = data.firstName || "";
          const last = data.surName || "";
          const summary = data.profileSummary || "";

          setFirstName(first);
          setSurName(last);
          setSummary(summary);
          setProfileComplete(!!(first && last));
          } catch (error) {
              console.error("Failed to fetch profile data:", error);
          }
      };
      fetchMyProfile();
  }, []);

  const typingTimeOutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectSocket();
    }
  }, []);

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

  const fetchConversation = async ({ selectedUser, selectedConversation, groupName, content, imageUrl }) => {
    try {
      if (selectedUser?.length > 0) {
        const response = await fetchWithAuth(`${API_URL}/conversations/findOrCreate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedUser: selectedUser.map((user) => user.id),
            groupName: groupName || null,
            content: content || null,
            imageUrl: imageUrl || null,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch or create conversation.");

        const data = await response.json();
        const conversation = data.conversation;

        if (!conversation) {
          return null;
        }

        const conversationId = data.conversation?.id;

        if (conversationId) {
          setConversationId(conversationId);
          setSelectedConversation(conversationId);
          fetchMessages(conversationId);
          setGroupName(data.conversation?.name || "");
          setContactView(false);
          return conversationId;
        } else {
          throw new Error("Conversation ID missing in response.");
        }
      } else if (selectedConversation) {
        setConversationId(selectedConversation);
        fetchMessages(selectedConversation);
        return selectedConversation;
      } else {
        throw new Error("No selected user or conversation ID provided.");
      }
    } catch (error) {
      console.error("Error fetching/creating conversation:", error);
    }
  };


  const markConversationAsRead = async (convId) => {
    try {
      await fetchWithAuth(`${API_URL}/messages/markasread`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId }),
      });
    } catch (error) {
      console.error("Failed to mark messages as read", error);
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
      await markConversationAsRead(convId);
      fetchMyConversations();
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const handleCreateGroup = (users, name) => {
  if (users.length > 1 && name) {
    setSelectedUser(users);
    setGroupName(name);
    fetchConversation({ selectedUser: users, groupName: name });
  } else {
    alert("Please select at least 2 members and enter a group name.");
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
     let convId = conversationId;
     
     if (!convId && !groupName) {
      const result = await fetchConversation({ 
        selectedUser,
        content: newMessage,
        imageUrl: imageFile ? "dummy" : null
       });

    convId = result || conversationId;
    setSelectedConversation(result);
    setContactView(false);

    if (!convId) {
      console.warn("No valid conversation ID, aborting message send.");
      return;
    }
  }
    const formData = new FormData();
    formData.append("conversationId", convId);
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
      fetchMyConversations();
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };
   
    const fetchMyConversations = async () => {
            try {
                const response = await fetchWithAuth(`${API_URL}/conversations/find`);
                const data = await response.json();
                setMyConversations([...data.conversations]);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        useEffect(() => {
            fetchMyConversations();
        }, []);


  return {
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    selectedUser,
    setSelectedUser,
    conversationId,
    setConversationId,
    setContactView,
    contactView,
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
    setImageFile,
    fetchMyConversations,
    myConversations,
    markConversationAsRead,
    handleCreateGroup,
    setMessageView,
    messageView,
    fetchConversation,
    firstName, 
    setFirstName,
    surName, 
    setSurName,
    summary, 
    setSummary,
    profileComplete
  };
};

export default useConversation;
