import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const SimpleThemeTest: React.FC = () => {
  try {
    const { colors, isDarkMode, toggleTheme } = useTheme();

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>
          Theme Test - {isDarkMode ? 'Dark' : 'Light'} Mode
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={toggleTheme}
        >
          <Text style={[styles.buttonText, { color: colors.buttonPrimaryText }]}>
            Toggle Theme
          </Text>
        </TouchableOpacity>
      </View>
    );
  } catch (error) {
    console.error('Theme test error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Theme Error: {error.message}</Text>
      </View>
    );
  }
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 20,
    margin: 10,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
  },
});

export default SimpleThemeTest;
