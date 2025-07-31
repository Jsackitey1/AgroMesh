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
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import { DashboardSummary, SensorNode } from '../../types';

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#4CAF50';
      case 'offline':
        return '#f44336';
      case 'maintenance':
        return '#ff9800';
      case 'error':
        return '#f44336';
      default:
        return '#9e9e9e';
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
    <View style={styles.summaryCard}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="white" />
      </View>
      <View style={styles.summaryContent}>
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summaryTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderSensorCard = (sensor: SensorNode) => (
    <TouchableOpacity key={sensor.id} style={styles.sensorCard}>
      <View style={styles.sensorHeader}>
        <View style={styles.sensorInfo}>
          <Text style={styles.sensorName}>{sensor.name}</Text>
          <Text style={styles.sensorId}>ID: {sensor.nodeId}</Text>
        </View>
        <View style={styles.sensorStatus}>
          <Ionicons
            name={getStatusIcon(sensor.status) as any}
            size={20}
            color={getStatusColor(sensor.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(sensor.status) }]}>
            {sensor.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.sensorDetails}>
        <View style={styles.sensorDetail}>
          <Ionicons name="battery-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{sensor.batteryLevel}%</Text>
        </View>
        <View style={styles.sensorDetail}>
          <Ionicons name="cellular-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{sensor.signalStrength} dBm</Text>
        </View>
        <View style={styles.sensorDetail}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(sensor.lastSeen).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="leaf" size={50} color="#4CAF50" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.profile.firstName}!
        </Text>
        <Text style={styles.welcomeSubtext}>
          Here's what's happening with your farm today
        </Text>
      </View>

      {/* Summary Cards */}
      {summary && (
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.summaryGrid}>
            {renderSummaryCard(
              'Total Sensors',
              summary.summary.totalNodes,
              'analytics',
              '#4CAF50'
            )}
            {renderSummaryCard(
              'Online Sensors',
              summary.summary.nodeStatusCounts.online,
              'checkmark-circle',
              '#4CAF50'
            )}
            {renderSummaryCard(
              'Recent Alerts',
              summary.summary.recentAlerts,
              'notifications',
              '#ff9800'
            )}
            {renderSummaryCard(
              'Unread Alerts',
              summary.summary.unreadAlerts,
              'mail-unread',
              '#f44336'
            )}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="add-circle" size={30} color="#4CAF50" />
            <Text style={styles.actionText}>Add Sensor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="camera" size={30} color="#2196F3" />
            <Text style={styles.actionText}>AI Diagnosis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="analytics" size={30} color="#9C27B0" />
            <Text style={styles.actionText}>View Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="settings" size={30} color="#FF9800" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sensor Status */}
      <View style={styles.sensorsSection}>
        <Text style={styles.sectionTitle}>Sensor Status</Text>
        {sensorNodes.length > 0 ? (
          sensorNodes.slice(0, 3).map(renderSensorCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="analytics-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No sensors found</Text>
            <Text style={styles.emptySubtext}>Add your first sensor to get started</Text>
          </View>
        )}
        {sensorNodes.length > 3 && (
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Sensors</Text>
            <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
          </TouchableOpacity>
        )}
      </View>

      {/* Latest Data */}
      {summary?.latestData && summary.latestData.length > 0 && (
        <View style={styles.latestDataSection}>
          <Text style={styles.sectionTitle}>Latest Readings</Text>
          {summary.latestData.slice(0, 2).map((data, index) => (
            <View key={index} style={styles.dataCard}>
              <View style={styles.dataHeader}>
                <Text style={styles.dataNodeName}>{data.node.name}</Text>
                <Text style={styles.dataTime}>
                  {new Date(data.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              <View style={styles.dataReadings}>
                {Object.entries(data.readings).slice(0, 3).map(([key, reading]) => (
                  <View key={key} style={styles.readingItem}>
                    <Text style={styles.readingLabel}>{key}</Text>
                    <Text style={styles.readingValue}>
                      {reading.value} {reading.unit}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666',
  },
  summarySection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionsSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  sensorsSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  sensorCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  sensorHeader: {
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
    fontWeight: 'bold',
    color: '#333',
  },
  sensorId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sensorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  sensorDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sensorDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 5,
  },
  latestDataSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  dataCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  dataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dataNodeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dataTime: {
    fontSize: 12,
    color: '#666',
  },
  dataReadings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readingItem: {
    alignItems: 'center',
  },
  readingLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  readingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
});

export default DashboardScreen; 