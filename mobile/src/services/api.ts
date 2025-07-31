import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  SensorNode,
  SensorData,
  Alert,
  DashboardSummary,
  AnalyticsData,
  AIResponse,
  ApiResponse,
  PaginatedResponse,
  LoginForm,
  RegisterForm,
  SensorRegistrationForm,
  ProfileUpdateForm,
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          // You might want to redirect to login here
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async register(data: RegisterForm): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginForm): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post('/auth/login', data);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(data: ProfileUpdateForm): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put('/auth/profile', data);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  // Sensor APIs
  async registerSensor(data: SensorRegistrationForm): Promise<ApiResponse<SensorNode>> {
    const response: AxiosResponse<ApiResponse<SensorNode>> = await this.api.post('/sensors/register', data);
    return response.data;
  }

  async getSensors(status?: string): Promise<{ sensorNodes: SensorNode[]; total: number }> {
    const params = status ? { status } : {};
    const response: AxiosResponse<{ sensorNodes: SensorNode[]; total: number }> = await this.api.get('/sensors', { params });
    return response.data;
  }

  async getSensorDetails(nodeId: string): Promise<SensorNode> {
    const response: AxiosResponse<SensorNode> = await this.api.get(`/sensors/${nodeId}`);
    return response.data;
  }

  async getSensorData(
    nodeId: string,
    startDate?: string,
    endDate?: string,
    limit: number = 100
  ): Promise<{ sensorData: SensorData[]; total: number; nodeId: string }> {
    const params: any = { limit };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response: AxiosResponse<{ sensorData: SensorData[]; total: number; nodeId: string }> = await this.api.get(
      `/sensors/${nodeId}/data`,
      { params }
    );
    return response.data;
  }

  async updateSensor(nodeId: string, data: Partial<SensorNode>): Promise<ApiResponse<SensorNode>> {
    const response: AxiosResponse<ApiResponse<SensorNode>> = await this.api.put(`/sensors/${nodeId}`, data);
    return response.data;
  }

  // Alert APIs
  async getAlerts(
    status?: string,
    type?: string,
    limit: number = 50,
    page: number = 1
  ): Promise<PaginatedResponse<Alert>> {
    const params: any = { limit, page };
    if (status) params.status = status;
    if (type) params.type = type;

    const response: AxiosResponse<PaginatedResponse<Alert>> = await this.api.get('/alerts', { params });
    return response.data;
  }

  async getUnreadAlertsCount(): Promise<{ unreadCount: number }> {
    const response: AxiosResponse<{ unreadCount: number }> = await this.api.get('/alerts/unread');
    return response.data;
  }

  async getAlertDetails(alertId: string): Promise<Alert> {
    const response: AxiosResponse<Alert> = await this.api.get(`/alerts/${alertId}`);
    return response.data;
  }

  async acknowledgeAlert(alertId: string, notes?: string): Promise<ApiResponse<Alert>> {
    const response: AxiosResponse<ApiResponse<Alert>> = await this.api.post(`/alerts/${alertId}/acknowledge`, { notes });
    return response.data;
  }

  async resolveAlert(alertId: string, notes?: string): Promise<ApiResponse<Alert>> {
    const response: AxiosResponse<ApiResponse<Alert>> = await this.api.post(`/alerts/${alertId}/resolve`, { notes });
    return response.data;
  }

  async dismissAlert(alertId: string, notes?: string): Promise<ApiResponse<Alert>> {
    const response: AxiosResponse<ApiResponse<Alert>> = await this.api.post(`/alerts/${alertId}/dismiss`, { notes });
    return response.data;
  }

  async markAllAlertsAsRead(): Promise<ApiResponse<{ updatedCount: number }>> {
    const response: AxiosResponse<ApiResponse<{ updatedCount: number }>> = await this.api.post('/alerts/mark-all-read');
    return response.data;
  }

  // Dashboard APIs
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response: AxiosResponse<DashboardSummary> = await this.api.get('/dashboard/summary');
    return response.data;
  }

  async getAnalytics(period: string = 'week', nodeId?: string): Promise<AnalyticsData> {
    const params: any = { period };
    if (nodeId) params.nodeId = nodeId;

    const response: AxiosResponse<AnalyticsData> = await this.api.get('/dashboard/analytics', { params });
    return response.data;
  }

  async getAlertsSummary(days: number = 7): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/dashboard/alerts-summary', { params: { days } });
    return response.data;
  }

  async getNodesOverview(): Promise<{ nodes: any[]; total: number }> {
    const response: AxiosResponse<{ nodes: any[]; total: number }> = await this.api.get('/dashboard/nodes-overview');
    return response.data;
  }

  // AI APIs
  async getAISuggestion(sensorData: any): Promise<AIResponse> {
    const response: AxiosResponse<AIResponse> = await this.api.post('/ai/suggest', sensorData);
    return response.data;
  }

  async diagnoseImage(imageUri: string): Promise<AIResponse> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'plant-image.jpg',
    } as any);

    const response: AxiosResponse<AIResponse> = await this.api.post('/ai/diagnose-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async diagnoseVideo(videoUri: string): Promise<AIResponse> {
    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'plant-video.mp4',
    } as any);

    const response: AxiosResponse<AIResponse> = await this.api.post('/ai/diagnose-video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async askAI(question: string): Promise<AIResponse> {
    const response: AxiosResponse<AIResponse> = await this.api.post('/ai/ask', { question });
    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<{ status: string }> {
    const response: AxiosResponse<{ status: string }> = await this.api.get('/health');
    return response.data;
  }

  // Utility methods
  async setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem('authToken', token);
  }

  async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  async removeAuthToken(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
  }

  async setUser(user: User): Promise<void> {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  }

  async getUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem('user');
  }

  async clearAuth(): Promise<void> {
    await this.removeAuthToken();
    await this.removeUser();
  }
}

export const apiService = new ApiService();
export default apiService; 