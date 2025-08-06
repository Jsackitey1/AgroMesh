import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

type ImageDiagnosisScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ImageDiagnosis'>;

interface DiagnosisResult {
  success: boolean;
  diagnosis?: string;
  message?: string;
  timestamp?: string;
  model?: string;
}

const ImageDiagnosisScreen: React.FC<{ navigation: ImageDiagnosisScreenNavigationProp }> = ({ navigation }) => {
  const { isAuthenticated, user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [cropType, setCropType] = useState('');
  const [location, setLocation] = useState('');

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to select images.');
      return false;
    }
    return true;
  };

  const selectImage = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to use AI features.');
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setDiagnosis(null); // Clear previous diagnosis
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const takePhoto = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to use AI features.');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setDiagnosis(null); // Clear previous diagnosis
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const analyzeImage = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to use AI features.');
      return;
    }

    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or take a photo first.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'plant-image.jpg',
      } as any);

      if (cropType) {
        formData.append('cropType', cropType);
      }
      if (location) {
        formData.append('location', location);
      }

      const result = await apiService.diagnoseImageEnhanced(formData);
      setDiagnosis(result as DiagnosisResult);
    } catch (error: any) {
      console.error('Analysis error:', error);
      if (error.response?.status === 401) {
        Alert.alert('Authentication Error', 'Please log in again to use AI features.');
      } else {
        Alert.alert('Analysis Failed', 'Failed to analyze image. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setSelectedImage(null);
    setDiagnosis(null);
    setCropType('');
    setLocation('');
  };

  // Show authentication message if not logged in
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Image Diagnosis</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.authMessage}>
          <Ionicons name="lock-closed" size={64} color="#666" />
          <Text style={styles.authTitle}>Authentication Required</Text>
          <Text style={styles.authDescription}>
            Please log in to your account to use AI-powered image diagnosis features.
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
        <Text style={styles.title}>Image Diagnosis</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome, {user?.email || 'Farmer'}!</Text>
          <Text style={styles.readyText}>Ready to analyze your plants</Text>
        </View>

        {/* Image Selection */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Select Plant Image</Text>
          
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity style={styles.changeImageButton} onPress={selectImage}>
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageButtons}>
              <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                <Ionicons name="camera" size={32} color="#4CAF50" />
                <Text style={styles.buttonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
                <Ionicons name="images" size={32} color="#4CAF50" />
                <Text style={styles.buttonText}>Select from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Context Information */}
        <View style={styles.contextSection}>
          <Text style={styles.sectionTitle}>Additional Context (Optional)</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Crop Type</Text>
            <TextInput
              style={styles.input}
              value={cropType}
              onChangeText={setCropType}
              placeholder="e.g., Corn, Tomatoes, Wheat"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g., North Field, Greenhouse"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Analysis Button */}
        {selectedImage && (
          <TouchableOpacity
            style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
            onPress={analyzeImage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="search" size={20} color="#fff" />
                <Text style={styles.analyzeButtonText}>Analyze Plant Health</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Diagnosis Results */}
        {diagnosis && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>AI Diagnosis Results</Text>
            
            {diagnosis.success ? (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.resultTitle}>Analysis Complete</Text>
                </View>
                
                <ScrollView style={styles.diagnosisText}>
                  <Text style={styles.diagnosisContent}>{diagnosis.diagnosis}</Text>
                </ScrollView>
                
                <View style={styles.resultMeta}>
                  <Text style={styles.metaText}>Model: {diagnosis.model}</Text>
                  <Text style={styles.metaText}>
                    {diagnosis.timestamp ? new Date(diagnosis.timestamp).toLocaleString() : ''}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={24} color="#f44336" />
                <Text style={styles.errorText}>{diagnosis.message}</Text>
              </View>
            )}
          </View>
        )}

        {/* Clear Button */}
        {(selectedImage || diagnosis) && (
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
  userInfo: {
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
    fontSize: 18,
    color: '#666',
  },
  imageSection: {
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
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageButton: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 8,
  },
  buttonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  changeImageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  changeImageText: {
    color: '#666',
    fontSize: 14,
  },
  contextSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  analyzeButtonText: {
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
  diagnosisText: {
    maxHeight: 300,
  },
  diagnosisContent: {
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    margin: 16,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  authDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
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

export default ImageDiagnosisScreen; 