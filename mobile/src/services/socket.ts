import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';
import { SocketEvents } from '../types';

const getDefaultSocketUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001';
  }

  return 'http://localhost:5001';
};

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || getDefaultSocketUrl();

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private authToken: string | null = null;

  // Event listeners
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    // Don't auto-connect, wait for authentication
    this.initializeSocket();
  }

  private initializeSocket(): void {
    try {
      console.log('Initializing socket connection to:', SOCKET_URL);

      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        forceNew: true,
        autoConnect: false, // Don't auto-connect, wait for auth
        // Add CORS handling for deployed backend
        withCredentials: false,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Socket initialization error:', error);
    }
  }

  // Set authentication token and connect
  public setAuthToken(token: string): void {
    console.log('Setting socket auth token');
    this.authToken = token;
    this.connect();
  }

  // Clear authentication token and disconnect
  public clearAuthToken(): void {
    console.log('Clearing socket auth token');
    this.authToken = null;
    this.disconnect();
  }

  // Connect with token (for manual connection)
  public connectWithToken(token: string): void {
    this.setAuthToken(token);
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('socketConnected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.emit('socketDisconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      this.emit('socketError', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.emit('socketReconnected', attemptNumber);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      this.emit('socketReconnectFailed');
    });

    // AgroMesh specific events
    this.socket.on('welcome', (data: SocketEvents['welcome']) => {
      console.log('Welcome message:', data);
      this.emit('welcome', data);
    });

    this.socket.on('sensorNodeRegistered', (data: SocketEvents['sensorNodeRegistered']) => {
      console.log('Sensor node registered:', data);
      this.emit('sensorNodeRegistered', data);
    });

    this.socket.on('sensorDataUpdate', (data: SocketEvents['sensorDataUpdate']) => {
      console.log('Sensor data update:', data);
      this.emit('sensorDataUpdate', data);
    });

    this.socket.on('newAlert', (data: SocketEvents['newAlert']) => {
      console.log('New alert:', data);
      this.emit('newAlert', data);
    });

    this.socket.on('alertUpdated', (data: SocketEvents['alertUpdated']) => {
      console.log('Alert updated:', data);
      this.emit('alertUpdated', data);
    });

    this.socket.on('alertsMarkedRead', (data: SocketEvents['alertsMarkedRead']) => {
      console.log('Alerts marked as read:', data);
      this.emit('alertsMarkedRead', data);
    });
  }

  // Public methods
  public connect(): void {
    if (this.socket && !this.isConnected && this.authToken) {
      console.log('Connecting socket with auth token');
      // Set auth token in socket auth
      this.socket.auth = { token: this.authToken };
      this.socket.connect();
    } else if (!this.authToken) {
      console.warn('Cannot connect socket: No authentication token provided');
    } else if (!this.socket) {
      console.warn('Cannot connect socket: Socket not initialized');
    } else if (this.isConnected) {
      console.log('Socket already connected');
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  public isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Event listener management
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public off(event: string, callback?: Function): void {
    if (!callback) {
      this.listeners.delete(event);
    } else {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in socket event callback for ${event}:`, error);
        }
      });
    }
  }

  // Emit events to server
  public emitToServer(event: string, data?: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }

  // Utility methods
  public getSocketId(): string | null {
    return this.socket?.id || null;
  }

  public getConnectionState(): string {
    if (!this.socket) return 'disconnected';
    return this.socket.connected ? 'connected' : 'disconnected';
  }

  // Cleanup
  public destroy(): void {
    this.disconnect();
    this.listeners.clear();
    this.socket = null;
  }
}

// Create singleton instance
export const socketService = new SocketService();
export default socketService;
