import React, { useState, useEffect, useRef } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import liveKitService, { LiveKitConfig, StreamAnalysis, StreamMetadata } from '../../services/livekit';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

type LiveStreamScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LiveStream'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LiveStreamScreenProps {
  navigation: any;
  route: any;
}

const LiveStreamScreen: React.FC<{ navigation: LiveStreamScreenNavigationProp }> = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [showSetupModal, setShowSetupModal] = useState(true);
  const [analysisHistory, setAnalysisHistory] = useState<StreamAnalysis[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [streamMetadata, setStreamMetadata] = useState<StreamMetadata>({});
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  
  const { user } = useAuth();

  useEffect(() => {
    // Set default values
    if (user) {
      setParticipantName(`${user.profile.firstName} ${user.profile.lastName}`);
    }
    setRoomName(`field-${Date.now()}`);

    // Setup event listeners
    const unsubscribeAnalysis = liveKitService.onAnalysisReceived(handleAnalysisReceived);
    const unsubscribeConnection = liveKitService.onConnectionChanged(handleConnectionChanged);
    const unsubscribeParticipants = liveKitService.onParticipantsChanged(handleParticipantsChanged);

    return () => {
      unsubscribeAnalysis();
      unsubscribeConnection();
      unsubscribeParticipants();
      disconnectFromRoom();
    };
  }, []);

  const handleAnalysisReceived = (analysis: StreamAnalysis) => {
    setAnalysisHistory(prev => [...prev, analysis]);
    setAnalyzing(false);
  };

  const handleConnectionChanged = (connected: boolean) => {
    setIsConnected(connected);
    if (!connected) {
      setIsStreaming(false);
    }
  };

  const handleParticipantsChanged = (newParticipants: any[]) => {
    setParticipants(newParticipants);
  };

  const connectToRoom = async () => {
    if (!roomName.trim() || !participantName.trim()) {
      Alert.alert('Error', 'Please enter room name and participant name');
      return;
    }

    setIsConnecting(true);

    try {
      const config: LiveKitConfig = {
        url: process.env.EXPO_PUBLIC_LIVEKIT_URL || '',
        apiKey: process.env.EXPO_PUBLIC_LIVEKIT_API_KEY || '',
        apiSecret: process.env.EXPO_PUBLIC_LIVEKIT_API_SECRET || '',
        roomName: roomName.trim(),
        participantName: participantName.trim(),
      };

      const success = await liveKitService.connect(config);
      
      if (success) {
        setShowSetupModal(false);
        Alert.alert('Success', 'Connected to room successfully!');
      } else {
        Alert.alert('Error', 'Failed to connect to room');
      }
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', 'Failed to connect to room');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromRoom = async () => {
    try {
      await liveKitService.disconnect();
      setIsConnected(false);
      setIsStreaming(false);
      setAnalysisHistory([]);
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const startStreaming = async () => {
    if (!isConnected) {
      Alert.alert('Error', 'Not connected to room');
      return;
    }

    try {
      // For now, we'll simulate streaming since WebRTC setup is complex
      // In a real implementation, this would start actual video streaming
      setIsStreaming(true);
      Alert.alert('Success', 'Started video streaming simulation!');
      
      // In production, you would call:
      // const success = await liveKitService.startVideoStream(streamMetadata);
      // if (success) {
      //   setIsStreaming(true);
      //   Alert.alert('Success', 'Started video streaming!');
      // } else {
      //   Alert.alert('Error', 'Failed to start video streaming');
      // }
    } catch (error) {
      console.error('Streaming error:', error);
      Alert.alert('Error', 'Failed to start video streaming');
    }
  };

  const stopStreaming = async () => {
    try {
      // For now, we'll simulate stopping streaming
      setIsStreaming(false);
      Alert.alert('Success', 'Stopped video streaming');
      
      // In production, you would call:
      // await liveKitService.stopVideoStream();
      // setIsStreaming(false);
      // Alert.alert('Success', 'Stopped video streaming');
    } catch (error) {
      console.error('Stop streaming error:', error);
    }
  };

  const sendAnalysisRequest = async () => {
    if (!currentPrompt.trim()) return;

    setAnalyzing(true);
    const prompt = currentPrompt;
    setCurrentPrompt('');

    try {
      await liveKitService.sendAnalysisRequest(prompt, 'general');
    } catch (error) {
      console.error('Analysis request error:', error);
      setAnalyzing(false);
      Alert.alert('Error', 'Failed to send analysis request');
    }
  };

  const updateStreamMetadata = async () => {
    try {
      await liveKitService.sendStreamMetadata(streamMetadata);
      setShowMetadataModal(false);
      Alert.alert('Success', 'Stream metadata updated');
    } catch (error) {
      console.error('Metadata update error:', error);
      Alert.alert('Error', 'Failed to update stream metadata');
    }
  };

  const getAnalysisTypeColor = (type: string) => {
    switch (type) {
      case 'plant_health':
        return '#4CAF50';
      case 'soil_condition':
        return '#8BC34A';
      case 'pest_detection':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Stream Area */}
      <View style={styles.videoContainer}>
        {isStreaming ? (
          <View style={styles.localVideo}>
            <View style={styles.streamingOverlay}>
              <Ionicons name="radio" size={32} color="#4CAF50" />
              <Text style={styles.streamingText}>Live Stream Active</Text>
              <Text style={styles.streamingSubtext}>Real-time video streaming</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderVideo}>
            <Ionicons name="videocam-outline" size={64} color="#ccc" />
            <Text style={styles.placeholderText}>No active stream</Text>
            <Text style={styles.placeholderSubtext}>
              Connect to a room and start streaming
            </Text>
          </View>
        )}

        {/* Connection Status */}
        <View style={styles.statusBar}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
          {isStreaming && (
            <View style={styles.streamingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.streamingText}>LIVE</Text>
            </View>
          )}
        </View>

        {/* Control Buttons */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={() => setShowMetadataModal(true)}
          >
            <Ionicons name="settings-outline" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, isStreaming ? styles.stopButton : styles.startButton]}
            onPress={isStreaming ? stopStreaming : startStreaming}
            disabled={!isConnected}
          >
            <Ionicons 
              name={isStreaming ? "stop" : "play"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Analysis Section */}
      <View style={styles.analysisContainer}>
        <View style={styles.analysisHeader}>
          <Text style={styles.analysisTitle}>Real-time Analysis</Text>
          <Text style={styles.participantCount}>
            {participants.length + 1} participant{participants.length !== 0 ? 's' : ''}
          </Text>
        </View>

        <ScrollView style={styles.analysisHistory} showsVerticalScrollIndicator={false}>
          {analysisHistory.length === 0 ? (
            <View style={styles.emptyAnalysis}>
              <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
              <Text style={styles.emptyAnalysisText}>
                Start streaming and ask questions for real-time AI analysis
              </Text>
            </View>
          ) : (
            analysisHistory.map((analysis, index) => (
              <View key={index} style={styles.analysisItem}>
                <View style={styles.analysisHeader}>
                  <View style={[
                    styles.analysisTypeBadge,
                    { backgroundColor: getAnalysisTypeColor(analysis.type) }
                  ]}>
                    <Text style={styles.analysisTypeText}>
                      {analysis.type.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.analysisTime}>
                    {new Date(analysis.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                <Text style={styles.analysisText}>{analysis.analysis}</Text>
                <Text style={styles.confidenceText}>
                  Confidence: {(analysis.confidence * 100).toFixed(1)}%
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={currentPrompt}
            onChangeText={setCurrentPrompt}
            placeholder="Ask about what you're seeing..."
            multiline
            maxLength={500}
            editable={isStreaming && isConnected}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!currentPrompt.trim() || !isStreaming || !isConnected || analyzing) && styles.sendButtonDisabled
            ]}
            onPress={sendAnalysisRequest}
            disabled={!currentPrompt.trim() || !isStreaming || !isConnected || analyzing}
          >
            {analyzing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Setup Modal */}
      <Modal
        visible={showSetupModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Setup Live Stream</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Room Name</Text>
              <TextInput
                style={styles.modalInput}
                value={roomName}
                onChangeText={setRoomName}
                placeholder="Enter room name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={styles.modalInput}
                value={participantName}
                onChangeText={setParticipantName}
                placeholder="Enter your name"
              />
            </View>

            <TouchableOpacity
              style={[styles.connectButton, isConnecting && styles.connectButtonDisabled]}
              onPress={connectToRoom}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="wifi" size={20} color="white" />
                  <Text style={styles.connectButtonText}>Connect to Room</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Metadata Modal */}
      <Modal
        visible={showMetadataModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Stream Metadata</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMetadataModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Field Name</Text>
              <TextInput
                style={styles.modalInput}
                value={streamMetadata.fieldName || ''}
                onChangeText={(text) => setStreamMetadata(prev => ({ ...prev, fieldName: text }))}
                placeholder="Enter field name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Crop Type</Text>
              <TextInput
                style={styles.modalInput}
                value={streamMetadata.cropType || ''}
                onChangeText={(text) => setStreamMetadata(prev => ({ ...prev, cropType: text }))}
                placeholder="Enter crop type"
              />
            </View>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={updateStreamMetadata}
            >
              <Ionicons name="save" size={20} color="white" />
              <Text style={styles.updateButtonText}>Update Metadata</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  localVideo: {
    flex: 1,
    backgroundColor: '#000',
  },
  placeholderVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  placeholderText: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 10,
  },
  placeholderSubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  localVideo: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streamingOverlay: {
    alignItems: 'center',
    padding: 20,
  },
  streamingText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  streamingSubtext: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  statusBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  streamingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
  },
  streamingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  analysisContainer: {
    height: screenHeight * 0.4,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  participantCount: {
    fontSize: 14,
    color: '#666',
  },
  analysisHistory: {
    flex: 1,
    padding: 15,
  },
  emptyAnalysis: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyAnalysisText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  analysisItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  analysisTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  analysisTypeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  analysisTime: {
    fontSize: 12,
    color: '#666',
  },
  analysisText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 80,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  connectButtonDisabled: {
    backgroundColor: '#ccc',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default LiveStreamScreen; 