import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URI;

// Create socket instance
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connect socket
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    console.log("Socket connecting...");
  }
};

// Register admin
export const registerAdmin = (adminId) => {
  socket.emit("registerAdmin", { adminId });
};

// Request driver location
export const requestDriverLocation = (rideId, adminId) => {
  socket.emit("getDriverLocationByRideId", { rideId, adminId });
};

// Listen for driver location
export const onDriverLocationUpdate = (callback) => {
  socket.on("driverLocationForAdmin", callback);
};

// Remove driver location listener
export const offDriverLocationUpdate = () => {
  socket.off("driverLocationForAdmin");
};

// Setup all listeners
export const setupListeners = () => {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("adminRegistered", (data) => {
    console.log("Admin registered:", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
};

// Check if connected
export const isSocketConnected = () => {
  return socket.connected;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Get socket ID
export const getSocketId = () => {
  return socket.id;
};

export default socket;