import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

type AIScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AI'>;

const AIScreen: React.FC<{ navigation: AIScreenNavigationProp }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="bulb" size={60} color="#4CAF50" />
          <Text style={styles.title}>AI Assistant</Text>
          <Text style={styles.subtitle}>Smart Agricultural Intelligence</Text>
        </View>

        <View style={styles.featuresContainer}>
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate('VideoCapture')}
          >
            <View style={styles.featureIcon}>
              <Ionicons name="videocam" size={32} color="#2E7D32" />
            </View>
            <Text style={styles.featureTitle}>Video Analysis</Text>
            <Text style={styles.featureDescription}>
              Record or upload agricultural videos for AI-powered analysis and insights
            </Text>
            <View style={styles.featureBadge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate('Videos')}
          >
            <View style={styles.featureIcon}>
              <Ionicons name="library" size={32} color="#2E7D32" />
            </View>
            <Text style={styles.featureTitle}>Video Library</Text>
            <Text style={styles.featureDescription}>
              View and manage your uploaded videos with AI analysis history
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate('LiveStream')}
          >
            <View style={styles.featureIcon}>
              <Ionicons name="radio" size={32} color="#2E7D32" />
            </View>
            <Text style={styles.featureTitle}>Live Stream Analysis</Text>
            <Text style={styles.featureDescription}>
              Stream live video for real-time AI analysis and expert consultation
            </Text>
            <View style={styles.featureBadge}>
              <Text style={styles.badgeText}>LIVE</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate('ImageDiagnosis')}
          >
            <View style={styles.featureIcon}>
              <Ionicons name="camera" size={32} color="#2E7D32" />
            </View>
            <Text style={styles.featureTitle}>Image Diagnosis</Text>
            <Text style={styles.featureDescription}>
              Upload photos for plant disease detection and treatment recommendations
            </Text>
            <View style={styles.featureBadge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate('AIChat')}
          >
            <View style={styles.featureIcon}>
              <Ionicons name="chatbubbles" size={32} color="#2E7D32" />
            </View>
            <Text style={styles.featureTitle}>AI Chat</Text>
            <Text style={styles.featureDescription}>
              Ask questions about farming practices, crop management, and more
            </Text>
            <View style={styles.featureBadge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate('SmartRecommendations')}
          >
            <View style={styles.featureIcon}>
              <Ionicons name="bulb" size={32} color="#2E7D32" />
            </View>
            <Text style={styles.featureTitle}>Smart Recommendations</Text>
            <Text style={styles.featureDescription}>
              Get personalized farming advice based on your data and conditions
            </Text>
            <View style={styles.featureBadge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works</Text>
          <View style={styles.infoItem}>
            <Ionicons name="ellipse" size={24} color="#4CAF50" />
            <Text style={styles.infoText}>Record or upload your agricultural video</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="ellipse" size={24} color="#4CAF50" />
            <Text style={styles.infoText}>AI analyzes the content for insights</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="ellipse" size={24} color="#4CAF50" />
            <Text style={styles.infoText}>Get detailed analysis and recommendations</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featureBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
});

export default AIScreen; 