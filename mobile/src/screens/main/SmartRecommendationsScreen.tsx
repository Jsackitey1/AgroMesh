import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

type SmartRecommendationsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SmartRecommendations'>;

interface RecommendationData {
  sensorData: {
    soilMoisture?: number;
    temperature?: number;
    humidity?: number;
    pH?: number;
  };
  weather: {
    forecast?: string;
    temperature?: number;
    humidity?: number;
    rainfall?: number;
  };
  season: string;
  crop: string;
  location: string;
  soilData: {
    type?: string;
    nutrients?: string;
  };
  pestHistory: string[];
}

interface AIRecommendation {
  success: boolean;
  recommendations?: string;
  message?: string;
  tokensUsed?: any;
  model?: string;
  timestamp?: string;
}

const SmartRecommendationsScreen: React.FC<{ navigation: SmartRecommendationsScreenNavigationProp }> = ({ navigation }) => {
  const { isAuthenticated, user } = useAuth();
  const [recommendationData, setRecommendationData] = useState<RecommendationData>({
    sensorData: {},
    weather: {},
    season: '',
    crop: '',
    location: '',
    soilData: {},
    pestHistory: [],
  });
  const [recommendations, setRecommendations] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [useSampleData, setUseSampleData] = useState(false);

  const sampleData: RecommendationData = {
    sensorData: {
      soilMoisture: 65,
      temperature: 24,
      humidity: 70,
      pH: 6.5,
    },
    weather: {
      forecast: 'Partly cloudy with light rain',
      temperature: 22,
      humidity: 75,
      rainfall: 5,
    },
    season: 'Spring',
    crop: 'Corn',
    location: 'North Field',
    soilData: {
      type: 'Loamy',
      nutrients: 'Nitrogen: Medium, Phosphorus: High, Potassium: Medium',
    },
    pestHistory: ['Corn borer', 'Aphids'],
  };

  const updateData = (section: keyof RecommendationData, field: string, value: any) => {
    setRecommendationData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const updateArrayData = (section: keyof RecommendationData, value: string[]) => {
    setRecommendationData(prev => ({
      ...prev,
      [section]: value,
    }));
  };

  const updateSimpleData = (field: keyof RecommendationData, value: string) => {
    setRecommendationData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getRecommendations = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to use AI features.');
      return;
    }

    if (!recommendationData.crop || !recommendationData.location) {
      Alert.alert('Missing Information', 'Please provide at least crop type and location.');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = useSampleData ? sampleData : recommendationData;
      const result = await apiService.getSmartRecommendations(dataToSend);
      setRecommendations(result as AIRecommendation);
    } catch (error: any) {
      console.error('Recommendations error:', error);
      if (error.response?.status === 401) {
        Alert.alert('Authentication Error', 'Please log in again to use AI features.');
      } else {
        Alert.alert('Error', 'Failed to generate recommendations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setRecommendationData({
      sensorData: {},
      weather: {},
      season: '',
      crop: '',
      location: '',
      soilData: {},
      pestHistory: [],
    });
    setRecommendations(null);
  };

  const renderInputSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  // Show authentication message if not logged in
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Smart Recommendations</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.authMessage}>
          <Ionicons name="lock-closed" size={64} color="#666" />
          <Text style={styles.authTitle}>Authentication Required</Text>
          <Text style={styles.authDescription}>
            Please log in to your account to get personalized farming recommendations.
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Smart Recommendations</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* User Welcome */}
        <View style={styles.userWelcome}>
          <Text style={styles.welcomeText}>Welcome, {user?.email || 'Farmer'}!</Text>
          <Text style={styles.readyText}>Get personalized farming advice</Text>
        </View>

        {/* Sample Data Toggle */}
        <View style={styles.sampleDataSection}>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Use Sample Data</Text>
            <Switch
              value={useSampleData}
              onValueChange={setUseSampleData}
              trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
              thumbColor={useSampleData ? '#fff' : '#f4f3f4'}
            />
          </View>
          {useSampleData && (
            <Text style={styles.sampleDataText}>
              Using sample data for demonstration. Toggle off to enter your own data.
            </Text>
          )}
        </View>

        {!useSampleData && (
          <>
            {/* Basic Information */}
            {renderInputSection('Basic Information', (
              <>
                <View style={styles.inputRow}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Crop Type *</Text>
                    <TextInput
                      style={styles.input}
                      value={recommendationData.crop}
                      onChangeText={(text) => updateSimpleData('crop', text)}
                      placeholder="e.g., Corn, Tomatoes, Wheat"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Location *</Text>
                    <TextInput
                      style={styles.input}
                      value={recommendationData.location}
                      onChangeText={(text) => updateSimpleData('location', text)}
                      placeholder="e.g., North Field, Greenhouse"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Season</Text>
                  <TextInput
                    style={styles.input}
                    value={recommendationData.season}
                    onChangeText={(text) => updateSimpleData('season', text)}
                    placeholder="e.g., Spring, Summer, Fall, Winter"
                    placeholderTextColor="#999"
                  />
                </View>
              </>
            ))}

            {/* Sensor Data */}
            {renderInputSection('Sensor Data (Optional)', (
              <>
                <View style={styles.inputRow}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Soil Moisture (%)</Text>
                    <TextInput
                      style={styles.input}
                      value={recommendationData.sensorData.soilMoisture?.toString() || ''}
                      onChangeText={(text) => updateData('sensorData', 'soilMoisture', parseFloat(text) || undefined)}
                      placeholder="0-100"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Temperature (°C)</Text>
                    <TextInput
                      style={styles.input}
                      value={recommendationData.sensorData.temperature?.toString() || ''}
                      onChangeText={(text) => updateData('sensorData', 'temperature', parseFloat(text) || undefined)}
                      placeholder="Temperature"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
                <View style={styles.inputRow}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Humidity (%)</Text>
                    <TextInput
                      style={styles.input}
                      value={recommendationData.sensorData.humidity?.toString() || ''}
                      onChangeText={(text) => updateData('sensorData', 'humidity', parseFloat(text) || undefined)}
                      placeholder="0-100"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Soil pH</Text>
                    <TextInput
                      style={styles.input}
                      value={recommendationData.sensorData.pH?.toString() || ''}
                      onChangeText={(text) => updateData('sensorData', 'pH', parseFloat(text) || undefined)}
                      placeholder="0-14"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </>
            ))}

            {/* Weather Data */}
            {renderInputSection('Weather Information (Optional)', (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Weather Forecast</Text>
                  <TextInput
                    style={styles.input}
                    value={recommendationData.weather.forecast || ''}
                    onChangeText={(text) => updateData('weather', 'forecast', text)}
                    placeholder="e.g., Sunny, Rainy, Cloudy"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.inputRow}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Expected Rainfall (mm)</Text>
                    <TextInput
                      style={styles.input}
                      value={recommendationData.weather.rainfall?.toString() || ''}
                      onChangeText={(text) => updateData('weather', 'rainfall', parseFloat(text) || undefined)}
                      placeholder="Rainfall amount"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </>
            ))}

            {/* Soil Data */}
            {renderInputSection('Soil Information (Optional)', (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Soil Type</Text>
                  <TextInput
                    style={styles.input}
                    value={recommendationData.soilData.type || ''}
                    onChangeText={(text) => updateData('soilData', 'type', text)}
                    placeholder="e.g., Sandy, Clay, Loamy"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nutrient Levels</Text>
                  <TextInput
                    style={styles.input}
                    value={recommendationData.soilData.nutrients || ''}
                    onChangeText={(text) => updateData('soilData', 'nutrients', text)}
                    placeholder="e.g., Nitrogen: High, Phosphorus: Medium"
                    placeholderTextColor="#999"
                  />
                </View>
              </>
            ))}

            {/* Pest History */}
            {renderInputSection('Pest History (Optional)', (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Previous Pests (comma-separated)</Text>
                <TextInput
                  style={styles.input}
                  value={recommendationData.pestHistory.join(', ')}
                  onChangeText={(text) => updateArrayData('pestHistory', text.split(',').map(p => p.trim()).filter(p => p))}
                  placeholder="e.g., Aphids, Corn borer, Spider mites"
                  placeholderTextColor="#999"
                />
              </View>
            ))}
          </>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, loading && styles.generateButtonDisabled]}
          onPress={getRecommendations}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="bulb" size={20} color="#fff" />
              <Text style={styles.generateButtonText}>Generate Smart Recommendations</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Recommendations Results */}
        {recommendations && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
            
            {recommendations.success ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.resultTitle}>Personalized Recommendations</Text>
                </View>
                
                <ScrollView style={styles.recommendationsText}>
                  <Text style={styles.recommendationsContent}>{recommendations.recommendations}</Text>
                </ScrollView>
                
                <View style={styles.resultMeta}>
                  <Text style={styles.metaText}>Model: {recommendations.model}</Text>
                  <Text style={styles.metaText}>
                    {recommendations.timestamp ? new Date(recommendations.timestamp).toLocaleString() : ''}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={24} color="#f44336" />
                <Text style={styles.errorText}>{recommendations.message}</Text>
              </View>
            )}
          </View>
        )}

        {/* Clear Button */}
        {(recommendations || (!useSampleData && (recommendationData.crop || recommendationData.location))) && (
          <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
            <Ionicons name="refresh" size={20} color="#666" />
            <Text style={styles.clearButtonText}>Start Over</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  userWelcome: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  readyText: {
    fontSize: 16,
    color: '#666',
  },
  sampleDataSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sampleDataText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  generateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  recommendationsText: {
    maxHeight: 400,
  },
  recommendationsContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  resultMeta: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  errorText: {
    marginLeft: 8,
    color: '#f44336',
    fontSize: 14,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  clearButtonText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  authMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  authDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SmartRecommendationsScreen; 