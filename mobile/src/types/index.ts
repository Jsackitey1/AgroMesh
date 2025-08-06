// User Types
export interface User {
  id: string;
  email: string;
  role: 'Farmer' | 'Admin' | 'Researcher';
  profile: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    language: 'en' | 'es' | 'fr' | 'pt' | 'sw';
    location?: {
      coordinates: [number, number]; // [longitude, latitude]
    };
    farmSize?: number;
    cropTypes?: string[];
  };
  preferences: {
    notifications: {
      push: boolean;
      sms: boolean;
      email: boolean;
      alertTypes: {
        irrigation: boolean;
        pestRisk: boolean;
        anomaly: boolean;
        aiSuggestion: boolean;
      };
    };
    units: {
      temperature: 'celsius' | 'fahrenheit';
      moisture: 'percentage' | 'volumetric';
    };
  };
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

// Sensor Types
export interface SensorNode {
  id: string;
  nodeId: string;
  name: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
  };
  status: 'online' | 'offline' | 'maintenance' | 'error';
  lastSeen: string;
  batteryLevel: number;
  signalStrength: number;
  configuration: {
    cropType?: string;
    soilType: 'sandy' | 'clay' | 'loamy' | 'silty' | 'unknown';
    irrigationType: 'drip' | 'sprinkler' | 'flood' | 'manual' | 'none';
    sensors: {
      soilMoisture: boolean;
      temperature: boolean;
      humidity: boolean;
      ph: boolean;
      nutrients: boolean;
      light: boolean;
    };
    thresholds: {
      soilMoisture: { min: number; max: number };
      temperature: { min: number; max: number };
      ph: { min: number; max: number };
    };
  };
  firmware: {
    version: string;
  };
}

export interface SensorReading {
  value: number;
  unit: string;
}

export interface SensorData {
  id: string;
  nodeId: string;
  timestamp: string;
  readings: {
    soilMoisture?: SensorReading;
    temperature?: SensorReading;
    humidity?: SensorReading;
    ph?: SensorReading;
    nutrients?: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
      unit: string;
    };
    light?: SensorReading;
    rainfall?: SensorReading;
    windSpeed?: SensorReading;
    windDirection?: SensorReading;
  };
  metadata: {
    batteryLevel: number;
    signalStrength: number;
    firmwareVersion?: string;
    dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  };
  location: {
    coordinates: [number, number];
  };
  aiAnalysis?: {
    irrigationRecommendation?: 'irrigate' | 'hold' | 'reduce';
    pestRisk?: {
      level: 'low' | 'medium' | 'high';
      probability: number;
    };
    anomaly?: {
      detected: boolean;
      type?: string;
      confidence?: number;
    };
  };
}

// Alert Types
export interface Alert {
  id: string;
  type: 'irrigation' | 'pestRisk' | 'anomaly' | 'aiSuggestion' | 'system' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  sensorNode?: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    soilMoisture?: number;
    threshold?: number;
    riskLevel?: 'low' | 'medium' | 'high';
    probability?: number;
    anomalyType?: string;
    confidence?: number;
    aiRecommendation?: string;
    actionRequired?: boolean;
  };
}

// Dashboard Types
export interface DashboardSummary {
  summary: {
    totalNodes: number;
    nodeStatusCounts: {
      online: number;
      offline: number;
      maintenance: number;
      error: number;
    };
    recentAlerts: number;
    unreadAlerts: number;
  };
  latestData: Array<{
    nodeId: string;
    timestamp: string;
    readings: any;
    node: {
      name: string;
    };
  }>;
}

export interface AnalyticsData {
  period: string;
  nodeId?: string;
  chartData: {
    soilMoisture: Array<{ timestamp: string; value: number }>;
    temperature: Array<{ timestamp: string; value: number }>;
    humidity: Array<{ timestamp: string; value: number }>;
    ph: Array<{ timestamp: string; value: number }>;
  };
  averages: {
    soilMoisture?: number;
    temperature?: number;
    humidity?: number;
    ph?: number;
  };
  totalReadings: number;
}

// AI Types
export interface AIResponse {
  success?: boolean;
  message?: string;
  answer?: string;
  diagnosis?: string;
  recommendations?: string;
  data?: any;
  error?: string;
  tokensUsed?: any;
  model?: string;
  timestamp?: string;
}

// API Response Types
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
  token?: string;
  user?: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Navigation Types
export type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Dashboard: undefined;
  Sensors: undefined;
  Alerts: undefined;
  AI: undefined;
  Profile: undefined;
  VideoCapture: undefined;
  Videos: undefined;
  LiveStream: undefined;
  ImageDiagnosis: undefined;
  AIChat: undefined;
  SmartRecommendations: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Sensors: undefined;
  Alerts: undefined;
  AI: undefined;
  Profile: undefined;
};

export type SensorStackParamList = {
  SensorList: undefined;
  SensorDetails: { nodeId: string };
  SensorData: { nodeId: string };
  AddSensor: undefined;
  EditSensor: { nodeId: string };
};

export type AlertStackParamList = {
  AlertList: undefined;
  AlertDetails: { alertId: string };
};

export type AIStackParamList = {
  AIHome: undefined;
  ImageDiagnosis: undefined;
  VideoDiagnosis: undefined;
  AskAI: undefined;
  AIHistory: undefined;
};

// Socket Events
export interface SocketEvents {
  welcome: { message: string };
  sensorNodeRegistered: { nodeId: string; name: string; owner: string };
  sensorDataUpdate: { nodeId: string; sensorData: any; timestamp: string };
  newAlert: { alertId: string; userId: string; type: string; severity: string; title: string; message: string };
  alertUpdated: { alertId: string; userId: string; status: string };
  alertsMarkedRead: { userId: string; count: number };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: 'Farmer' | 'Admin' | 'Researcher';
}

export interface SensorRegistrationForm {
  nodeId: string;
  name: string;
  coordinates: [number, number];
  cropType?: string;
  soilType?: 'sandy' | 'clay' | 'loamy' | 'silty' | 'unknown';
}

export interface ProfileUpdateForm {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  language?: 'en' | 'es' | 'fr' | 'pt' | 'sw';
  preferences?: Partial<User['preferences']>;
}

// App State Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: string;
  theme: 'light' | 'dark';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface SensorState {
  nodes: SensorNode[];
  selectedNode: SensorNode | null;
  sensorData: SensorData[];
  isLoading: boolean;
  error: string | null;
}

export interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardState {
  summary: DashboardSummary | null;
  analytics: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
} 