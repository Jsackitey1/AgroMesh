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

export const lightTheme: ThemeColors = {
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

export const darkTheme: ThemeColors = {
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

export const getTheme = (isDark: boolean): ThemeColors => {
  return isDark ? darkTheme : lightTheme;
};
