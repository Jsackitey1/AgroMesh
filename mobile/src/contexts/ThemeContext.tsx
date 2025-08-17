import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

// Define theme colors directly in this file to avoid import issues
export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border and divider colors
  border: string;
  divider: string;
  
  // Input colors
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  
  // Button colors
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  
  // Navigation colors
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  headerBackground: string;
  headerText: string;
  
  // Modal colors
  modalBackground: string;
  modalOverlay: string;
  
  // Switch colors
  switchTrack: string;
  switchThumb: string;
  switchTrackActive: string;
  switchThumbActive: string;
}

const lightTheme: ThemeColors = {
  // Background colors
  background: '#f5f5f5',
  surface: '#ffffff',
  card: '#ffffff',
  
  // Text colors
  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // Primary colors
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#388E3C',
  
  // Secondary colors
  secondary: '#2196F3',
  secondaryLight: '#64B5F6',
  secondaryDark: '#1976D2',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#f44336',
  info: '#2196F3',
  
  // Border and divider colors
  border: '#e0e0e0',
  divider: '#f0f0f0',
  
  // Input colors
  inputBackground: '#f9f9f9',
  inputBorder: '#ddd',
  inputText: '#333333',
  inputPlaceholder: '#999999',
  
  // Button colors
  buttonPrimary: '#4CAF50',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#f5f5f5',
  buttonSecondaryText: '#666666',
  
  // Navigation colors
  tabBarBackground: '#ffffff',
  tabBarActive: '#4CAF50',
  tabBarInactive: '#999999',
  headerBackground: '#4CAF50',
  headerText: '#ffffff',
  
  // Modal colors
  modalBackground: '#ffffff',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  
  // Switch colors
  switchTrack: '#767577',
  switchThumb: '#f4f3f4',
  switchTrackActive: '#4CAF50',
  switchThumbActive: '#ffffff',
};

const darkTheme: ThemeColors = {
  // Background colors
  background: '#121212',
  surface: '#1e1e1e',
  card: '#2d2d2d',
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  textTertiary: '#808080',
  
  // Primary colors
  primary: '#81C784',
  primaryLight: '#A5D6A7',
  primaryDark: '#4CAF50',
  
  // Secondary colors
  secondary: '#64B5F6',
  secondaryLight: '#90CAF9',
  secondaryDark: '#2196F3',
  
  // Status colors
  success: '#81C784',
  warning: '#FFB74D',
  error: '#E57373',
  info: '#64B5F6',
  
  // Border and divider colors
  border: '#404040',
  divider: '#2d2d2d',
  
  // Input colors
  inputBackground: '#2d2d2d',
  inputBorder: '#404040',
  inputText: '#ffffff',
  inputPlaceholder: '#808080',
  
  // Button colors
  buttonPrimary: '#81C784',
  buttonPrimaryText: '#000000',
  buttonSecondary: '#2d2d2d',
  buttonSecondaryText: '#b0b0b0',
  
  // Navigation colors
  tabBarBackground: '#1e1e1e',
  tabBarActive: '#81C784',
  tabBarInactive: '#808080',
  headerBackground: '#1e1e1e',
  headerText: '#ffffff',
  
  // Modal colors
  modalBackground: '#2d2d2d',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  
  // Switch colors
  switchTrack: '#404040',
  switchThumb: '#808080',
  switchTrackActive: '#81C784',
  switchThumbActive: '#ffffff',
};

const getTheme = (isDark: boolean): ThemeColors => {
  return isDark ? darkTheme : lightTheme;
};

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDarkMode: false,
  colors: {
    background: '#f5f5f5',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    primary: '#4CAF50',
    primaryLight: '#81C784',
    primaryDark: '#388E3C',
    secondary: '#2196F3',
    secondaryLight: '#64B5F6',
    secondaryDark: '#1976D2',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#f44336',
    info: '#2196F3',
    border: '#e0e0e0',
    divider: '#f0f0f0',
    inputBackground: '#f9f9f9',
    inputBorder: '#ddd',
    inputText: '#333333',
    inputPlaceholder: '#999999',
    buttonPrimary: '#4CAF50',
    buttonPrimaryText: '#ffffff',
    buttonSecondary: '#f5f5f5',
    buttonSecondaryText: '#666666',
    tabBarBackground: '#ffffff',
    tabBarActive: '#4CAF50',
    tabBarInactive: '#999999',
    headerBackground: '#4CAF50',
    headerText: '#ffffff',
    modalBackground: '#ffffff',
    modalOverlay: 'rgba(0, 0, 0, 0.5)',
    switchTrack: '#767577',
    switchThumb: '#f4f3f4',
    switchTrackActive: '#4CAF50',
    switchThumbActive: '#ffffff',
  },
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  
  // Add error handling for getTheme function
  const getThemeColors = (isDark: boolean): ThemeColors => {
    try {
      return getTheme(isDark);
    } catch (error) {
      console.error('Error getting theme colors:', error);
      // Fallback to light theme if there's an error
      return getTheme(false);
    }
  };
  
  const colors = getThemeColors(theme === 'dark');

  useEffect(() => {
    // Load saved theme from AsyncStorage
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    isDarkMode: theme === 'dark',
    colors,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
