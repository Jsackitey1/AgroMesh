import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import socketService from './src/services/socket';

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
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}
