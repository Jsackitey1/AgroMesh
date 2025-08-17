import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import socketService from './src/services/socket';
// import './src/config/firebase'; // Initialize Firebase - temporarily disabled

export default function App() {
  useEffect(() => {
    // Initialize socket connection when app starts
    socketService.connect();

    // Cleanup socket connection when app unmounts
    return () => {
      socketService.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
