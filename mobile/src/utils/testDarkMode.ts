import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const testDarkMode = async () => {
  try {
    // Test theme persistence
    const savedTheme = await AsyncStorage.getItem('theme');
    console.log('✅ Saved theme:', savedTheme);

    // Test theme toggle
    const newTheme = savedTheme === 'dark' ? 'light' : 'dark';
    await AsyncStorage.setItem('theme', newTheme);
    console.log('✅ Theme toggled to:', newTheme);

    // Test theme retrieval
    const retrievedTheme = await AsyncStorage.getItem('theme');
    console.log('✅ Retrieved theme:', retrievedTheme);

    Alert.alert(
      'Dark Mode Test',
      `Theme test completed!\n\nCurrent theme: ${retrievedTheme}\nTheme persistence: ${savedTheme === retrievedTheme ? 'Working' : 'Failed'}`,
      [{ text: 'OK' }]
    );

    return true;
  } catch (error) {
    console.error('❌ Dark mode test failed:', error);
    Alert.alert('Error', 'Dark mode test failed');
    return false;
  }
};

export const clearThemePreference = async () => {
  try {
    await AsyncStorage.removeItem('theme');
    console.log('✅ Theme preference cleared');
    Alert.alert('Success', 'Theme preference has been cleared');
    return true;
  } catch (error) {
    console.error('❌ Failed to clear theme preference:', error);
    Alert.alert('Error', 'Failed to clear theme preference');
    return false;
  }
};

export const getThemeStatus = async () => {
  try {
    const theme = await AsyncStorage.getItem('theme');
    const notifications = await AsyncStorage.getItem('notificationsEnabled');
    const language = await AsyncStorage.getItem('language');

    const status = {
      theme: theme || 'light (default)',
      notifications: notifications ? JSON.parse(notifications) : true,
      language: language || 'en (default)',
    };

    console.log('📊 Theme Status:', status);
    return status;
  } catch (error) {
    console.error('❌ Failed to get theme status:', error);
    return null;
  }
};
