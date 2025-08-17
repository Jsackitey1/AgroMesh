import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import LanguageSelectionModal from '../../components/LanguageSelectionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { currentLanguage } = useLanguage();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Load notification preference from AsyncStorage
  useEffect(() => {
    loadNotificationPreference();
  }, []);

  const loadNotificationPreference = async () => {
    try {
      const savedPreference = await AsyncStorage.getItem('notificationsEnabled');
      if (savedPreference !== null) {
        setNotificationsEnabled(JSON.parse(savedPreference));
      }
    } catch (error) {
      console.error('Error loading notification preference:', error);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));
      setNotificationsEnabled(value);
      
      if (value) {
        Alert.alert(
          'Notifications Enabled',
          'You will now receive push notifications for important updates.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Notifications Disabled',
          'You will no longer receive push notifications. You can re-enable them anytime.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error saving notification preference:', error);
      Alert.alert('Error', 'Failed to save notification preference');
    }
  };

  const handleDarkModeToggle = () => {
    toggleTheme();
    Alert.alert(
      'Theme Changed',
      `Switched to ${isDarkMode ? 'light' : 'dark'} mode.`,
      [{ text: 'OK' }]
    );
  };

  const handleLanguagePress = () => {
    setShowLanguageModal(true);
  };

  const handleChangePasswordPress = () => {
    setShowChangePasswordModal(true);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleSupportPress = (type: string) => {
    switch (type) {
      case 'help':
        Alert.alert(
          'Help & FAQ',
          'For help and frequently asked questions, please visit our website or contact support.',
          [
            { text: 'Visit Website', onPress: () => console.log('Open website') },
            { text: 'Contact Support', onPress: () => console.log('Contact support') },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        break;
      case 'contact':
        Alert.alert(
          'Contact Support',
          'How would you like to contact support?',
          [
            { text: 'Email', onPress: () => console.log('Open email') },
            { text: 'Phone', onPress: () => console.log('Open phone') },
            { text: 'Chat', onPress: () => console.log('Open chat') },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        break;
      case 'terms':
        Alert.alert(
          'Terms of Service',
          'Terms of Service content would be displayed here.',
          [{ text: 'OK' }]
        );
        break;
      case 'privacy':
        Alert.alert(
          'Privacy Policy',
          'Privacy Policy content would be displayed here.',
          [{ text: 'OK' }]
        );
        break;
    }
  };

  const renderProfileSection = () => (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Information</Text>
      <View style={styles.profileCard}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.divider }]}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.profile.firstName} {user?.profile.lastName}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
          <Text style={[styles.userRole, { color: colors.primary }]}>{user?.role}</Text>
        </View>
      </View>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
      
      <View style={[styles.settingItem, { borderBottomColor: colors.divider }]}>
        <View style={styles.settingInfo}>
          <Ionicons name="notifications" size={20} color={colors.textSecondary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Push Notifications</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationToggle}
          trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
          thumbColor={notificationsEnabled ? colors.switchThumbActive : colors.switchThumb}
        />
      </View>

      <View style={[styles.settingItem, { borderBottomColor: colors.divider }]}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon" size={20} color={colors.textSecondary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={handleDarkModeToggle}
          trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
          thumbColor={isDarkMode ? colors.switchThumbActive : colors.switchThumb}
        />
      </View>

      <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.divider }]} onPress={handleLanguagePress}>
        <View style={styles.settingInfo}>
          <Ionicons name="language" size={20} color={colors.textSecondary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Language</Text>
        </View>
        <View style={styles.settingValue}>
          <Text style={[styles.settingValueText, { color: colors.textSecondary }]}>{currentLanguage.name}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.divider }]} onPress={handleChangePasswordPress}>
        <View style={styles.settingInfo}>
          <Ionicons name="lock-closed" size={20} color={colors.textSecondary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Change Password</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderSupportSection = () => (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
      
      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomColor: colors.divider }]}
        onPress={() => handleSupportPress('help')}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="help-circle" size={20} color={colors.textSecondary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Help & FAQ</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomColor: colors.divider }]}
        onPress={() => handleSupportPress('contact')}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="mail" size={20} color={colors.textSecondary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Contact Support</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomColor: colors.divider }]}
        onPress={() => handleSupportPress('terms')}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="document-text" size={20} color={colors.textSecondary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Terms of Service</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomColor: colors.divider }]}
        onPress={() => handleSupportPress('privacy')}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="shield-checkmark" size={20} color={colors.textSecondary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Privacy Policy</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderLogoutSection = () => (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <TouchableOpacity 
        style={[
          styles.logoutButton, 
          { 
            backgroundColor: colors.error + '10',
            borderColor: colors.error 
          }
        ]} 
        onPress={handleLogout}
      >
        <Ionicons name="log-out" size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {renderProfileSection()}
        {renderSettingsSection()}
        {renderSupportSection()}
        {renderLogoutSection()}
      </ScrollView>

      {/* Modals */}
      <ChangePasswordModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
      
      <LanguageSelectionModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 14,
    marginRight: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen; 