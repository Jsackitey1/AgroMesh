// Utility to test backend connections
import { apiService } from '../services/api';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export const testBackendConnection = async (): Promise<ConnectionTestResult> => {
  try {
    console.log('🔍 Testing backend connection...');
    
    // Test basic health endpoint
    const healthResponse = await apiService.healthCheck();
    console.log('✅ Health check passed:', healthResponse);
    
    // Test authentication endpoint (without token)
    try {
      await apiService.getProfile();
      return {
        success: false,
        message: 'Backend is accessible but authentication is not working properly',
        details: { health: 'ok', auth: 'failed' }
      };
    } catch (authError: any) {
      if (authError.response?.status === 401) {
        // This is expected - we're not authenticated
        return {
          success: true,
          message: 'Backend connection is working properly',
          details: { health: 'ok', auth: 'unauthorized (expected)' }
        };
      } else {
        return {
          success: false,
          message: 'Backend is accessible but authentication endpoint has issues',
          details: { health: 'ok', auth: 'error', error: authError.message }
        };
      }
    }
  } catch (error: any) {
    console.error('❌ Backend connection test failed:', error);
    
    if (error.message?.includes('Network Error') || error.message?.includes('Network request failed')) {
      return {
        success: false,
        message: 'Cannot connect to backend server. Please check your internet connection.',
        details: { error: error.message }
      };
    } else if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        message: 'Backend server is not responding. The server might be down.',
        details: { error: error.message }
      };
    } else if (error.code === 'ENOTFOUND') {
      return {
        success: false,
        message: 'Cannot resolve backend server address. Please check the API configuration.',
        details: { error: error.message }
      };
    } else {
      return {
        success: false,
        message: 'Backend connection failed with an unexpected error.',
        details: { error: error.message }
      };
    }
  }
};

export const testVideoAPI = async (): Promise<ConnectionTestResult> => {
  try {
    console.log('🔍 Testing video API...');
    
    // Test video endpoint (should return 401 if not authenticated, which is expected)
    try {
      await apiService.getVideos();
      return {
        success: true,
        message: 'Video API is working (user is authenticated)',
        details: { endpoint: '/videos', status: 'ok' }
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        return {
          success: true,
          message: 'Video API endpoint is accessible (authentication required as expected)',
          details: { endpoint: '/videos', status: 'unauthorized (expected)' }
        };
      } else {
        return {
          success: false,
          message: 'Video API endpoint has issues',
          details: { endpoint: '/videos', error: error.message }
        };
      }
    }
  } catch (error: any) {
    console.error('❌ Video API test failed:', error);
    return {
      success: false,
      message: 'Video API test failed',
      details: { error: error.message }
    };
  }
};

export const runFullConnectionTest = async (): Promise<{
  backend: ConnectionTestResult;
  videoAPI: ConnectionTestResult;
  summary: string;
}> => {
  console.log('🚀 Running full connection test...');
  
  const backendTest = await testBackendConnection();
  const videoAPITest = await testVideoAPI();
  
  let summary = '';
  if (backendTest.success && videoAPITest.success) {
    summary = '✅ All connection tests passed! The backend is working properly.';
  } else if (backendTest.success && !videoAPITest.success) {
    summary = '⚠️ Backend is accessible but video API has issues.';
  } else if (!backendTest.success) {
    summary = '❌ Backend connection failed. Please check your internet connection and try again.';
  } else {
    summary = '❌ Multiple connection issues detected.';
  }
  
  return {
    backend: backendTest,
    videoAPI: videoAPITest,
    summary
  };
};
