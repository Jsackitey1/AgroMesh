import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const testDarkModeFinal = async () => {
  try {
    console.log('🧪 Final Dark Mode Test...');
    
    // Test theme persistence
    const savedTheme = await AsyncStorage.getItem('theme');
    console.log('✅ Saved theme:', savedTheme);
    
    // Test theme toggle
    const newTheme = savedTheme === 'dark' ? 'light' : 'dark';
    await AsyncStorage.setItem('theme', newTheme);
    console.log('✅ Theme toggled to:', newTheme);
    
    Alert.alert(
      'Dark Mode Test Complete',
      `Theme successfully toggled to ${newTheme} mode!\n\nPlease restart the app to see the changes.`,
      [{ text: 'OK' }]
    );
    
    return true;
  } catch (error) {
    console.error('❌ Dark mode test failed:', error);
    Alert.alert('Error', 'Dark mode test failed');
    return false;
  }
};

export const getCurrentThemeStatus = async () => {
  try {
    const theme = await AsyncStorage.getItem('theme');
    const notifications = await AsyncStorage.getItem('notificationsEnabled');
    const language = await AsyncStorage.getItem('language');
    
    const status = {
      theme: theme || 'light (default)',
      notifications: notifications ? JSON.parse(notifications) : true,
      language: language || 'en (default)',
    };
    
    console.log('📊 Current Theme Status:', status);
    
    Alert.alert(
      'Current Theme Status',
      `Theme: ${status.theme}\nNotifications: ${status.notifications ? 'Enabled' : 'Disabled'}\nLanguage: ${status.language}`,
      [{ text: 'OK' }]
    );
    
    return status;
  } catch (error) {
    console.error('❌ Failed to get theme status:', error);
    return null;
  }
};
