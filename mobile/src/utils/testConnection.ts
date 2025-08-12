// Utility to test backend connections
import { io } from 'socket.io-client';

export const testBackendConnection = async () => {
  const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

  console.log('Testing backend connections...');
  console.log('API URL:', API_URL);
  console.log('Socket URL:', SOCKET_URL);

  // Test HTTP API
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ API Health Check:', data);
  } catch (error) {
    console.error('❌ API Health Check Failed:', error);
  }

  // Test WebSocket connection
  if (SOCKET_URL) {
    const testSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      autoConnect: false,
    });

    testSocket.on('connect', () => {
      console.log('✅ Socket connection successful');
      testSocket.disconnect();
    });

    testSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection failed:', error);
    });

    testSocket.on('welcome', (data) => {
      console.log('✅ Welcome message received:', data);
    });

    // Try to connect
    testSocket.connect();
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (!testSocket.connected) {
        console.log('⏰ Socket connection timeout');
        testSocket.disconnect();
      }
    }, 10000);
  }
};

export default testBackendConnection;
