import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginForm, RegisterForm, ProfileUpdateForm } from '../types';
import apiService from '../services/api';

// Action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
};

// Context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginForm) => Promise<boolean>;
  register: (userData: RegisterForm) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateForm) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  clearError: () => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await apiService.getAuthToken();
        const user = await apiService.getUser();

        if (token && user) {
          dispatch({ type: 'SET_TOKEN', payload: token });
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginForm): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.login(credentials);

      if (response.token && response.user) {
        await apiService.setAuthToken(response.token);
        await apiService.setUser(response.user);

        dispatch({ type: 'SET_TOKEN', payload: response.token });
        dispatch({ type: 'SET_USER', payload: response.user });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Login failed' });
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  // Register function
  const register = async (userData: RegisterForm): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.register(userData);

      if (response.token && response.user) {
        await apiService.setAuthToken(response.token);
        await apiService.setUser(response.user);

        dispatch({ type: 'SET_TOKEN', payload: response.token });
        dispatch({ type: 'SET_USER', payload: response.user });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Registration failed' });
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await apiService.clearAuth();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update profile function
  const updateProfile = async (data: ProfileUpdateForm): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.updateProfile(data);

      if (response.user) {
        await apiService.setUser(response.user);
        dispatch({ type: 'SET_USER', payload: response.user });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Profile update failed' });
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.changePassword(currentPassword, newPassword);

      if (response.message) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Password change failed' });
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Computed values
  const isAuthenticated = !!state.user && !!state.token;

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 