import { Alert } from 'react-native';

export const testThemeSystem = () => {
  try {
    // Test if the theme context is working
    console.log('🧪 Testing theme system...');
    
    // This will be called from a component that has access to the theme context
    Alert.alert(
      'Theme System Test',
      'Theme system test initiated. Check console for debug output.',
      [{ text: 'OK' }]
    );
    
    return true;
  } catch (error) {
    console.error('❌ Theme system test failed:', error);
    Alert.alert('Error', 'Theme system test failed');
    return false;
  }
};

export const logThemeDebugInfo = (themeContext: any) => {
  console.log('🔍 Theme Debug Info:');
  console.log('- Theme context:', themeContext);
  console.log('- Theme:', themeContext?.theme);
  console.log('- Is Dark Mode:', themeContext?.isDarkMode);
  console.log('- Colors:', themeContext?.colors);
  console.log('- Colors type:', typeof themeContext?.colors);
  console.log('- Colors keys:', themeContext?.colors ? Object.keys(themeContext.colors) : 'undefined');
};
