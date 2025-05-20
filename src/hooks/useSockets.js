import { useEffect } from "react";
import socket from "../utils/socket";

const useSocketListeners = ({ conversationId, setMessages, setIsTyping, setOnlineUserIds }) => {
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleTyping = () => {
      setIsTyping(true);
    };

    const handleStopTyping = () => {
      setIsTyping(false);
    };

    const handleOnlineUsers = (ids) => {
      setOnlineUserIds(new Set(ids));
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("online_users", handleOnlineUsers);
    };
  }, [conversationId, setMessages, setIsTyping, setOnlineUserIds]);
};

export default useSocketListeners;
