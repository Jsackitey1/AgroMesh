import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import socketService from './src/services/socket';
// import './src/config/firebase'; // Initialize Firebase - temporarily disabled

const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Initialize socket connection when app starts
    socketService.connect();

    // Cleanup socket connection when app unmounts
    return () => {
      socketService.destroy();
    };
  }, []);

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
