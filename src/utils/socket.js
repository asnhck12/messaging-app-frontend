import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: { token: localStorage.getItem("token") },
  autoConnect: false,
});

function connectSocket() {
  const token = localStorage.getItem("token");
  if (token && !socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
}

export { socket as default, connectSocket };
