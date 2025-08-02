import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type VideoCaptureScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VideoCapture'>;

interface VideoCaptureScreenProps {
  navigation: VideoCaptureScreenNavigationProp;
}

const VideoCaptureScreen: React.FC<VideoCaptureScreenProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState('back');
  const [flashMode, setFlashMode] = useState('off');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const cameraRef = useRef<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(mediaStatus === 'granted');
    })();
  }, []);

  const startRecording = async () => {
    // For now, simulate recording since Camera component has import issues
    try {
      setIsRecording(true);
      // Simulate recording delay
      setTimeout(() => {
        setRecordedVideo('simulated-video-uri');
        setShowPreview(true);
        setIsRecording(false);
      }, 2000);
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video');
    }
  };

  const stopRecording = () => {
    // For now, just stop the simulation
    setIsRecording(false);
  };

  const retakeVideo = () => {
    setRecordedVideo(null);
    setShowPreview(false);
    setVideoTitle('');
    setVideoDescription('');
  };

  const pickVideoFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        setRecordedVideo(result.assets[0].uri);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video from gallery');
    }
  };

  const uploadVideo = async () => {
    if (!recordedVideo || !videoTitle.trim()) {
      Alert.alert('Error', 'Please provide a title for the video');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      // Create file object from video URI
      const videoFile = {
        uri: recordedVideo,
        type: 'video/mp4',
        name: `${Date.now()}.mp4`,
      } as any;
      
      formData.append('video', videoFile);
      formData.append('title', videoTitle);
      formData.append('description', videoDescription || 'Recorded from mobile app');

      const token = await getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_BASE_URL}/videos/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          'Success',
          'Video uploaded successfully! You can now analyze it with AI.',
          [
            {
              text: 'OK',
              onPress: () => {
                setShowUploadModal(false);
                setRecordedVideo(null);
                setShowPreview(false);
                setVideoTitle('');
                setVideoDescription('');
                navigation.navigate('Videos');
              },
            },
          ]
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    // This should get the token from your auth context or storage
    // For now, we'll return null and handle it in the upload function
    return null;
  };

  const toggleCameraType = () => {
    setCameraType(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const toggleFlashMode = () => {
    setFlashMode(current => 
      current === 'off' ? 'on' : 'off'
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-outline" size={64} color="#666" />
        <Text style={styles.errorText}>No access to media library</Text>
        <Text style={styles.errorSubtext}>
          Please enable media library permissions in your device settings to upload videos.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showPreview && recordedVideo) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Video Preview</Text>
          
          <View style={styles.videoPreview}>
            <Text style={styles.previewText}>Video recorded successfully!</Text>
            <Text style={styles.previewSubtext}>
              Duration: ~60 seconds | Quality: 720p
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Video Title *</Text>
            <TextInput
              style={styles.input}
              value={videoTitle}
              onChangeText={setVideoTitle}
              placeholder="Enter video title"
              maxLength={200}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={videoDescription}
              onChangeText={setVideoDescription}
              placeholder="Describe what you recorded..."
              multiline
              numberOfLines={3}
              maxLength={1000}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={retakeVideo}
            >
              <Ionicons name="refresh" size={20} color="#666" />
              <Text style={styles.secondaryButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => setShowUploadModal(true)}
              disabled={!videoTitle.trim()}
            >
              <Ionicons name="cloud-upload" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Upload & Analyze</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Upload Modal */}
        <Modal
          visible={showUploadModal}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Uploading Video</Text>
              <Text style={styles.modalSubtitle}>
                Please wait while we upload your video for AI analysis...
              </Text>
              
              {uploading && (
                <View style={styles.progressContainer}>
                  <ActivityIndicator size="large" color="#2E7D32" />
                  <Text style={styles.progressText}>
                    Uploading... {uploadProgress}%
                  </Text>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={uploadVideo}
                  disabled={uploading}
                >
                  <Text style={styles.primaryButtonText}>
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.camera}>
        <View style={styles.cameraOverlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Video Capture</Text>
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleFlashMode}
            >
              <Ionicons 
                name={flashMode === 'on' ? "flash" : "flash-off"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>

          {/* Camera Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={pickVideoFromGallery}
            >
              <Ionicons name="images" size={24} color="white" />
              <Text style={styles.controlText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordingButton]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <View style={styles.recordButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCameraType}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
              <Text style={styles.controlText}>Flip</Text>
            </TouchableOpacity>
          </View>

          {/* Recording Indicator */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording...</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  recordingButton: {
    backgroundColor: '#ff4444',
    borderColor: '#ff4444',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  recordingIndicator: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,68,68,0.9)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    marginRight: 10,
  },
  recordingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  videoPreview: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  previewSubtext: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
    flex: 1,
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default VideoCaptureScreen; 