import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { logThemeDebugInfo, testThemeSystem } from '../utils/testThemeSystem';

const ThemeTest: React.FC = () => {
  const themeContext = useTheme();
  const { colors, isDarkMode, theme, toggleTheme } = themeContext;

  useEffect(() => {
    // Log debug info when component mounts
    logThemeDebugInfo(themeContext);
  }, [themeContext]);

  const handleTestTheme = () => {
    testThemeSystem();
    logThemeDebugInfo(themeContext);
  };

  const handleToggleTheme = () => {
    console.log('🔄 Toggling theme...');
    toggleTheme();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        Theme Test Component
      </Text>
      <Text style={[styles.subtext, { color: colors.textSecondary }]}>
        Current Theme: {theme}
      </Text>
      <Text style={[styles.subtext, { color: colors.textSecondary }]}>
        Is Dark Mode: {isDarkMode ? 'Yes' : 'No'}
      </Text>
      <Text style={[styles.subtext, { color: colors.primary }]}>
        Primary Color: {colors.primary}
      </Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleTestTheme}
      >
        <Text style={[styles.buttonText, { color: colors.buttonPrimaryText }]}>
          Test Theme System
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.secondary }]}
        onPress={handleToggleTheme}
      >
        <Text style={[styles.buttonText, { color: colors.buttonPrimaryText }]}>
          Toggle Theme
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ThemeTest;
