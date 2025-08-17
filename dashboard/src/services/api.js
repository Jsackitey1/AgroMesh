// API service configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Request interceptor to add auth token
const addAuthToken = (config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor for error handling
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    ...API_CONFIG,
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  };

  // Add auth token
  const requestConfig = addAuthToken(config);

  const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, requestConfig);
  return handleResponse(response);
};

// API service methods
export const apiService = {
  // Authentication
  auth: {
    login: (credentials) => apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
    register: (userData) => apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
    logout: () => apiRequest('/auth/logout', {
      method: 'POST',
    }),
    
    changePassword: (passwords) => apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    }),
    
    updateProfile: (profileData) => apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
  },

  // Sensors
  sensors: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/sensors?${queryString}`);
    },
    
    getById: (nodeId) => apiRequest(`/sensors/${nodeId}`),
    
    register: (sensorData) => apiRequest('/sensors/register', {
      method: 'POST',
      body: JSON.stringify(sensorData),
    }),
    
    update: (nodeId, updateData) => apiRequest(`/sensors/${nodeId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),
    
    delete: (nodeId) => apiRequest(`/sensors/${nodeId}`, {
      method: 'DELETE',
    }),
    
    getData: (nodeId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/sensors/${nodeId}/data?${queryString}`);
    },
    
    submitData: (nodeId, sensorData) => apiRequest(`/sensors/${nodeId}/data`, {
      method: 'POST',
      body: JSON.stringify(sensorData),
    }),
  },

  // Alerts
  alerts: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/alerts?${queryString}`);
    },
    
    getById: (alertId) => apiRequest(`/alerts/${alertId}`),
    
    acknowledge: (alertId, notes) => apiRequest(`/alerts/${alertId}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
    
    resolve: (alertId, notes) => apiRequest(`/alerts/${alertId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
    
    dismiss: (alertId, notes) => apiRequest(`/alerts/${alertId}/dismiss`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
    
    markAllAsRead: () => apiRequest('/alerts/mark-all-read', {
      method: 'POST',
    }),
    
    getUnreadCount: () => apiRequest('/alerts/unread'),
  },

  // Dashboard
  dashboard: {
    getSummary: () => apiRequest('/dashboard/summary'),
  },

  // AI
  ai: {
    chat: (message) => apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
    
    analyzeImage: (imageData) => apiRequest('/ai/analyze-image', {
      method: 'POST',
      body: JSON.stringify({ image: imageData }),
    }),
  },

  // Videos
  videos: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/videos?${queryString}`);
    },
    
    getById: (videoId) => apiRequest(`/videos/${videoId}`),
    
    upload: (formData) => {
      const config = {
        ...API_CONFIG,
        headers: {}, // Let browser set Content-Type for FormData
      };
      
      const requestConfig = addAuthToken(config);
      
      return fetch(`${API_CONFIG.baseURL}/videos/upload`, {
        ...requestConfig,
        method: 'POST',
        body: formData,
      }).then(handleResponse);
    },
    
    analyze: (videoId) => apiRequest(`/videos/${videoId}/analyze`, {
      method: 'POST',
    }),
    
    delete: (videoId) => apiRequest(`/videos/${videoId}`, {
      method: 'DELETE',
    }),
    
    getAnalysisHistory: (videoId) => apiRequest(`/videos/${videoId}/analysis-history`),
  },

  // Health check
  health: () => apiRequest('/health'),
};

// Export configuration for external use
export { API_CONFIG };

export default apiService;
