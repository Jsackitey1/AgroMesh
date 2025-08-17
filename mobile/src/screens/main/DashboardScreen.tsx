import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, ThemeColors } from '../../contexts/ThemeContext';
import apiService from '../../services/api';
import { DashboardSummary, SensorNode } from '../../types';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [sensorNodes, setSensorNodes] = useState<SensorNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [summaryData, sensorsData] = await Promise.all([
        apiService.getDashboardSummary(),
        apiService.getSensors(),
      ]);
      
      setSummary(summaryData);
      setSensorNodes(sensorsData.sensorNodes);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'addSensor':
        navigation.navigate('Sensors' as never);
        break;
      case 'aiDiagnosis':
        navigation.navigate('AI' as never);
        break;
      case 'viewAnalytics':
        navigation.navigate('Sensors' as never);
        break;
      case 'settings':
        navigation.navigate('Profile' as never);
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return colors.success;
      case 'offline':
        return colors.error;
      case 'maintenance':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.textTertiary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return 'checkmark-circle';
      case 'offline':
        return 'close-circle';
      case 'maintenance':
        return 'construct';
      case 'error':
        return 'warning';
      default:
        return 'help-circle';
    }
  };

  const renderSummaryCard = (title: string, value: number, icon: string, color: string) => (
    <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.summaryCardHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={[styles.summaryCardTitle, { color: colors.textSecondary }]}>{title}</Text>
      </View>
      <Text style={[styles.summaryCardValue, { color: colors.text }]}>{value}</Text>
    </View>
  );

  const renderQuickAction = (icon: string, title: string, action: string, color: string) => (
    <TouchableOpacity 
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={() => handleQuickAction(action)}
    >
      <Ionicons name={icon as any} size={24} color={colors.buttonPrimaryText} />
      <Text style={[styles.actionButtonText, { color: colors.buttonPrimaryText }]}>{title}</Text>
    </TouchableOpacity>
  );

  const renderSensorCard = (sensor: SensorNode) => (
    <TouchableOpacity
      key={sensor.id}
      style={[styles.sensorCard, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.sensorCardHeader}>
        <View style={styles.sensorInfo}>
          <Text style={[styles.sensorName, { color: colors.text }]}>{sensor.name}</Text>
          <Text style={[styles.sensorLocation, { color: colors.textSecondary }]}>{sensor.location.address || `${sensor.location.coordinates[0]}, ${sensor.location.coordinates[1]}`}</Text>
        </View>
        <View style={styles.sensorStatus}>
          <Ionicons 
            name={getStatusIcon(sensor.status) as any} 
            size={20} 
            color={getStatusColor(sensor.status)} 
          />
          <Text style={[styles.sensorStatusText, { color: getStatusColor(sensor.status) }]}>
            {sensor.status}
          </Text>
        </View>
      </View>
      <View style={styles.sensorMetrics}>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Battery</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>{sensor.batteryLevel}%</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Signal</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>{sensor.signalStrength} dBm</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Last Seen</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>{new Date(sensor.lastSeen).toLocaleDateString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Welcome back, {user?.profile.firstName}!
        </Text>
        <Text style={[styles.welcomeSubtext, { color: colors.textSecondary }]}>
          Here's what's happening with your farm today
        </Text>
      </View>

      {/* Summary Cards */}
      {summary && (
        <View style={styles.summarySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
          <View style={styles.summaryGrid}>
            {renderSummaryCard(
              'Total Sensors',
              summary.summary.totalNodes,
              'analytics',
              colors.primary
            )}
            {renderSummaryCard(
              'Online Sensors',
              summary.summary.nodeStatusCounts.online,
              'checkmark-circle',
              colors.success
            )}
            {renderSummaryCard(
              'Recent Alerts',
              summary.summary.recentAlerts,
              'notifications',
              colors.warning
            )}
            {renderSummaryCard(
              'Unread Alerts',
              summary.summary.unreadAlerts,
              'mail-unread',
              colors.error
            )}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {renderQuickAction('add', 'Add Sensor', 'addSensor', colors.primary)}
          {renderQuickAction('camera', 'AI Diagnosis', 'aiDiagnosis', colors.secondary)}
          {renderQuickAction('analytics', 'View Analytics', 'viewAnalytics', colors.info)}
          {renderQuickAction('settings', 'Settings', 'settings', colors.warning)}
        </View>
      </View>

      {/* Recent Sensors */}
      <View style={styles.sensorsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Sensors</Text>
        {sensorNodes.slice(0, 3).map(renderSensorCard)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  welcomeSection: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
  },
  summarySection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryCardTitle: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
  summaryCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionsSection: {
    padding: 20,
    paddingTop: 10,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  sensorsSection: {
    padding: 20,
    paddingTop: 10,
  },
  sensorCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  sensorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  sensorLocation: {
    fontSize: 14,
  },
  sensorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sensorStatusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  sensorMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen; 