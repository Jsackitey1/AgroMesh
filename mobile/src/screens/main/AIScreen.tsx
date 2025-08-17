import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../types';

type AIScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AI'>;

const AIScreen: React.FC<{ navigation: AIScreenNavigationProp }> = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="bulb" size={60} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>AI Assistant</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Smart Agricultural Intelligence</Text>
        </View>

        <View style={styles.featuresContainer}>
          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: colors.card, shadowColor: colors.text }]}
            onPress={() => navigation.navigate('VideoCapture')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="videocam" size={32} color={colors.primaryDark} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Video Analysis</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Record or upload agricultural videos for AI-powered analysis and insights
            </Text>
            <View style={[styles.featureBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.buttonPrimaryText }]}>NEW</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: colors.card, shadowColor: colors.text }]}
            onPress={() => navigation.navigate('Videos')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="library" size={32} color={colors.primaryDark} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Video Library</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              View and manage your uploaded videos with AI analysis history
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: colors.card, shadowColor: colors.text }]}
            onPress={() => navigation.navigate('LiveStream')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="radio" size={32} color={colors.primaryDark} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Live Stream Analysis</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Stream live video for real-time AI analysis and expert consultation
            </Text>
            <View style={[styles.featureBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.buttonPrimaryText }]}>LIVE</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: colors.card, shadowColor: colors.text }]}
            onPress={() => navigation.navigate('ImageDiagnosis')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="camera" size={32} color={colors.primaryDark} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Image Diagnosis</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Upload photos for plant disease detection and treatment recommendations
            </Text>
            <View style={[styles.featureBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.buttonPrimaryText }]}>NEW</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: colors.card, shadowColor: colors.text }]}
            onPress={() => navigation.navigate('AIChat')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="chatbubbles" size={32} color={colors.primaryDark} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>AI Chat</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Ask questions about farming practices, crop management, and more
            </Text>
            <View style={[styles.featureBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.buttonPrimaryText }]}>NEW</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: colors.card, shadowColor: colors.text }]}
            onPress={() => navigation.navigate('SmartRecommendations')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="bulb" size={32} color={colors.primaryDark} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Smart Recommendations</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Get personalized farming advice based on your data and conditions
            </Text>
            <View style={[styles.featureBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.buttonPrimaryText }]}>NEW</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>How it works</Text>
          <View style={styles.infoItem}>
            <Ionicons name="ellipse" size={24} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Record or upload your agricultural video</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="ellipse" size={24} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>AI analyzes the content for insights</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="ellipse" size={24} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Get detailed analysis and recommendations</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 15,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  featureBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '600',
  },
  infoSection: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    marginLeft: 10,
    flex: 1,
  },
});

export default AIScreen; 