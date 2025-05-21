import { useEffect } from "react";
import socket from "../utils/socket";

const useSocketListeners = ({ conversationId, setMessages, setIsTyping, setOnlineUserIds }) => {
  useEffect(() => {
    if (!socket) return;
    // connectSocket();

    const handleReceiveMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleTyping = () => {
      setIsTyping(true);
    };

    const handleStopTyping = () => {
      setIsTyping(false);
    };

    const handleOnlineUsers = ({userIds}) => {
      setOnlineUserIds(new Set(userIds));
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

useEffect(() => {
        if (!conversationId || !socket.connected) return;

        socket.emit("join_conversation", conversationId);

        const handleIncomingTyping = () => {
                setIsTyping(true);
        };

        const handleStopIncomingTyping = () => {
                setIsTyping(false);
        };

        socket.on("set_typing", handleIncomingTyping);
        socket.on("set_stop_typing", handleStopIncomingTyping);

        return () => {
            socket.emit("leave_conversation", conversationId);
            socket.off("set_typing", handleIncomingTyping);
            socket.off("set_stop_typing", handleStopIncomingTyping);
        };
    }, [conversationId, setIsTyping]);
    };

export default useSocketListeners;
