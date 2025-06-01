// src/socket.js (Frontend)
import { io } from 'socket.io-client';


const socket = io(process.env.REACT_APP_BACKEND_URL, {
  withCredentials: true,
  // You can pass query parameters if needed for initial auth/identification
  // query: { userId } // Example, if your backend needs userId on connection
});

export default socket;