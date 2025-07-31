import React, { useState } from 'react';
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

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

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

  const renderProfileSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Profile Information</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="#4CAF50" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>
            {user?.profile.firstName} {user?.profile.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userRole}>{user?.role}</Text>
        </View>
      </View>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Settings</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="notifications" size={20} color="#666" />
          <Text style={styles.settingText}>Push Notifications</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#767577', true: '#4CAF50' }}
          thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon" size={20} color="#666" />
          <Text style={styles.settingText}>Dark Mode</Text>
        </View>
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          trackColor={{ false: '#767577', true: '#4CAF50' }}
          thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="language" size={20} color="#666" />
          <Text style={styles.settingText}>Language</Text>
        </View>
        <View style={styles.settingValue}>
          <Text style={styles.settingValueText}>English</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="lock-closed" size={20} color="#666" />
          <Text style={styles.settingText}>Change Password</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderSupportSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Support</Text>
      
      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="help-circle" size={20} color="#666" />
          <Text style={styles.settingText}>Help & FAQ</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="mail" size={20} color="#666" />
          <Text style={styles.settingText}>Contact Support</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="document-text" size={20} color="#666" />
          <Text style={styles.settingText}>Terms of Service</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Ionicons name="shield-checkmark" size={20} color="#666" />
          <Text style={styles.settingText}>Privacy Policy</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderLogoutSection = () => (
    <View style={styles.section}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#f44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderProfileSection()}
      {renderSettingsSection()}
      {renderSupportSection()}
      {renderLogoutSection()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#f0f0f0',
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
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f44336',
    marginLeft: 8,
  },
});

export default ProfileScreen; 