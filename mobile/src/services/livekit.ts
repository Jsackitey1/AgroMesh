import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalParticipant,
  RemoteTrack,
  DataPacket_Kind,
  DisconnectReason,
  ConnectionState,
} from 'livekit-client';

export interface LiveKitConfig {
  url: string;
  apiKey: string;
  apiSecret: string;
  roomName: string;
  participantName: string;
}

export interface StreamAnalysis {
  timestamp: string;
  analysis: string;
  confidence: number;
  type: 'plant_health' | 'soil_condition' | 'pest_detection' | 'general';
}

export interface StreamMetadata {
  location?: {
    latitude: number;
    longitude: number;
  };
  cropType?: string;
  fieldName?: string;
  weather?: {
    temperature: number;
    humidity: number;
    conditions: string;
  };
}

class LiveKitService {
  private room: Room | null = null;
  private config: LiveKitConfig | null = null;
  private isConnected = false;
  private analysisCallbacks: ((analysis: StreamAnalysis) => void)[] = [];
  private connectionCallbacks: ((connected: boolean) => void)[] = [];
  private participantCallbacks: ((participants: RemoteParticipant[]) => void)[] = [];

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (this.room) {
      this.room
        .on(RoomEvent.Connected, this.handleConnected.bind(this))
        .on(RoomEvent.Disconnected, this.handleDisconnected.bind(this))
        .on(RoomEvent.ParticipantConnected, this.handleParticipantConnected.bind(this))
        .on(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected.bind(this))
        .on(RoomEvent.DataReceived, this.handleDataReceived.bind(this))
        .on(RoomEvent.ConnectionStateChanged, this.handleConnectionStateChanged.bind(this));
    }
  }

  async connect(config: LiveKitConfig): Promise<boolean> {
    try {
      this.config = config;
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
        publishDefaults: {
          simulcast: true,
          videoSimulcastLayers: [
            { width: 320, height: 180, fps: 15 },
            { width: 640, height: 360, fps: 30 },
            { width: 1280, height: 720, fps: 30 },
          ],
        },
      });

      this.setupEventListeners();

      // Connect to the room
      await this.room.connect(config.url, config.apiKey, {
        metadata: JSON.stringify({
          name: config.participantName,
          type: 'farmer',
          timestamp: new Date().toISOString(),
        }),
      });

      return true;
    } catch (error) {
      console.error('Failed to connect to LiveKit room:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.room) {
      await this.room.disconnect();
      this.room = null;
      this.isConnected = false;
    }
  }

  async startVideoStream(metadata?: StreamMetadata): Promise<boolean> {
    if (!this.room || !this.isConnected) {
      console.error('Not connected to room');
      return false;
    }

    try {
      // Request camera and microphone permissions
      await this.room.localParticipant.enableCameraAndMicrophone();

      // Set metadata for the stream
      if (metadata) {
        await this.room.localParticipant.setMetadata(JSON.stringify(metadata));
      }

      return true;
    } catch (error) {
      console.error('Failed to start video stream:', error);
      return false;
    }
  }

  async stopVideoStream(): Promise<void> {
    if (this.room && this.isConnected) {
      await this.room.localParticipant.disableCameraAndMicrophone();
    }
  }

  async sendAnalysisRequest(prompt: string, analysisType: string): Promise<void> {
    if (!this.room || !this.isConnected) {
      console.error('Not connected to room');
      return;
    }

    try {
      const data = {
        type: 'analysis_request',
        prompt,
        analysisType,
        timestamp: new Date().toISOString(),
        participantId: this.room.localParticipant.identity,
      };

      await this.room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(data)),
        DataPacket_Kind.RELIABLE
      );
    } catch (error) {
      console.error('Failed to send analysis request:', error);
    }
  }

  async sendStreamMetadata(metadata: StreamMetadata): Promise<void> {
    if (!this.room || !this.isConnected) {
      console.error('Not connected to room');
      return;
    }

    try {
      await this.room.localParticipant.setMetadata(JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to send stream metadata:', error);
    }
  }

  // Event handlers
  private handleConnected() {
    console.log('Connected to LiveKit room');
    this.isConnected = true;
    this.connectionCallbacks.forEach(callback => callback(true));
  }

  private handleDisconnected(reason?: DisconnectReason) {
    console.log('Disconnected from LiveKit room:', reason);
    this.isConnected = false;
    this.connectionCallbacks.forEach(callback => callback(false));
  }

  private handleParticipantConnected(participant: RemoteParticipant) {
    console.log('Participant connected:', participant.identity);
    this.updateParticipantList();
  }

  private handleParticipantDisconnected(participant: RemoteParticipant) {
    console.log('Participant disconnected:', participant.identity);
    this.updateParticipantList();
  }

  private handleDataReceived(payload: Uint8Array, participant: RemoteParticipant) {
    try {
      const data = JSON.parse(new TextDecoder().decode(payload));
      
      if (data.type === 'analysis_response') {
        const analysis: StreamAnalysis = {
          timestamp: data.timestamp,
          analysis: data.analysis,
          confidence: data.confidence,
          type: data.analysisType,
        };
        
        this.analysisCallbacks.forEach(callback => callback(analysis));
      }
    } catch (error) {
      console.error('Failed to parse received data:', error);
    }
  }

  private handleConnectionStateChanged(state: ConnectionState) {
    console.log('Connection state changed:', state);
  }

  private updateParticipantList() {
    if (this.room) {
      const participants = Array.from(this.room.participants.values());
      this.participantCallbacks.forEach(callback => callback(participants));
    }
  }

  // Getters
  getRoom(): Room | null {
    return this.room;
  }

  isRoomConnected(): boolean {
    return this.isConnected;
  }

  getLocalParticipant(): LocalParticipant | null {
    return this.room?.localParticipant || null;
  }

  getRemoteParticipants(): RemoteParticipant[] {
    return this.room ? Array.from(this.room.participants.values()) : [];
  }

  getConnectionState(): ConnectionState | undefined {
    return this.room?.connectionState;
  }

  // Callback registration
  onAnalysisReceived(callback: (analysis: StreamAnalysis) => void): () => void {
    this.analysisCallbacks.push(callback);
    return () => {
      const index = this.analysisCallbacks.indexOf(callback);
      if (index > -1) {
        this.analysisCallbacks.splice(index, 1);
      }
    };
  }

  onConnectionChanged(callback: (connected: boolean) => void): () => void {
    this.connectionCallbacks.push(callback);
    return () => {
      const index = this.connectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1);
      }
    };
  }

  onParticipantsChanged(callback: (participants: RemoteParticipant[]) => void): () => void {
    this.participantCallbacks.push(callback);
    return () => {
      const index = this.participantCallbacks.indexOf(callback);
      if (index > -1) {
        this.participantCallbacks.splice(index, 1);
      }
    };
  }

  // Utility methods
  async getRoomToken(roomName: string, participantName: string): Promise<string> {
    // This should be called from your backend to get a token
    // For now, we'll return a placeholder
    return 'placeholder_token';
  }

  async createRoom(roomName: string): Promise<boolean> {
    // This should be called from your backend to create a room
    // For now, we'll return true
    return true;
  }
}

// Export singleton instance
export const liveKitService = new LiveKitService();
export default liveKitService; 