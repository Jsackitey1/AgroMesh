import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens (to be created)
import DashboardScreen from '../screens/main/DashboardScreen';
import SensorsScreen from '../screens/main/SensorsScreen';
import AlertsScreen from '../screens/main/AlertsScreen';
import AIScreen from '../screens/main/AIScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import VideosScreen from '../screens/main/VideosScreen';
import VideoCaptureScreen from '../screens/main/VideoCaptureScreen';
import LiveStreamScreen from '../screens/main/LiveStreamScreen';
import ImageDiagnosisScreen from '../screens/main/ImageDiagnosisScreen';
import AIChatScreen from '../screens/main/AIChatScreen';
import SmartRecommendationsScreen from '../screens/main/SmartRecommendationsScreen';

// Loading Screen
import LoadingScreen from '../screens/LoadingScreen';

import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main Tab Navigator
const MainTabNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Sensors') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'AI') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: Math.max(bottom, 10),
          paddingTop: 5,
          height: 60 + Math.max(bottom, 10),
          elevation: 0,
          shadowOpacity: 0,
        },
        headerStyle: {
          backgroundColor: colors.headerBackground,
        },
        headerTintColor: colors.headerText,
        headerTitleStyle: {
          color: colors.headerText,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ 
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Sensors" 
        component={SensorsScreen}
        options={{ 
          title: 'My Sensors',
          tabBarLabel: 'Sensors',
        }}
      />
      <Tab.Screen 
        name="Alerts" 
        component={AlertsScreen}
        options={{ 
          title: 'Alerts',
          tabBarLabel: 'Alerts',
          tabBarBadge: undefined, // Will be set dynamically
        }}
      />
      <Tab.Screen 
        name="AI" 
        component={AIScreen}
        options={{ 
          title: 'AI Assistant',
          tabBarLabel: 'AI',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// Root Stack Navigator
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: false, // We handle dark mode ourselves
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.error,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="Videos" component={VideosScreen} />
            <Stack.Screen name="VideoCapture" component={VideoCaptureScreen} />
            <Stack.Screen name="LiveStream" component={LiveStreamScreen} />
            <Stack.Screen name="ImageDiagnosis" component={ImageDiagnosisScreen} />
            <Stack.Screen name="AIChat" component={AIChatScreen} />
            <Stack.Screen name="SmartRecommendations" component={SmartRecommendationsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 