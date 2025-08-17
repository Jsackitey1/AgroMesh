import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

type VideosScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Videos'>;

const { width: screenWidth } = Dimensions.get('window');

interface Video {
  _id: string;
  title: string;
  description: string;
  fileSize: number;
  duration: number;
  status: string;
  aiSummary?: string;
  uploadDate: string;
  createdAt: string;
}

interface Analysis {
  _id: string;
  prompt: string;
  response: string;
  confidence: number;
  processingTime: number;
  status: string;
  createdAt: string;
}

const VideosScreen: React.FC<{ navigation: VideosScreenNavigationProp }> = ({ navigation }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<Analysis[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const data = await apiService.getVideos();
      setVideos(data.videos || []);
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('Network Error') || error.message?.includes('Network request failed')) {
        Alert.alert(
          'Connection Error', 
          'Unable to connect to the server. Please check your internet connection and try again.',
          [
            { text: 'Retry', onPress: () => fetchVideos() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      } else if (error.response?.status === 401) {
        Alert.alert('Authentication Error', 'Please log in again to continue.');
      } else {
        Alert.alert('Error', 'Failed to load videos. Please try again later.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAnalysisHistory = async (videoId: string) => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const data = await apiService.getVideoAnalysisHistory(videoId);
      setAnalysisHistory(data.analyses || []);
    } catch (error: any) {
      console.error('Error fetching analysis history:', error);
      // Don't show alert for history fetch errors as they're not critical
    }
  };

  const analyzeVideo = async (videoId: string, prompt: string, analysisType = 'question') => {
    setAnalyzing(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const data = await apiService.analyzeVideo(videoId, prompt, analysisType);
      
      // Add to analysis history
      setAnalysisHistory(prev => [...prev, data.analysis]);
      
      // Update video list if summary was generated
      if (analysisType === 'summary' && data.success) {
        fetchVideos();
      }

      Alert.alert(
        'Success',
        data.success ? 'Analysis completed!' : 'Analysis failed',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Analysis error:', error);
      
      if (error.message?.includes('Network Error') || error.message?.includes('Network request failed')) {
        Alert.alert('Connection Error', 'Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'Failed to analyze video. Please try again later.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteVideo = async (videoId: string) => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteVideo(videoId);
              setVideos(prev => prev.filter(video => video._id !== videoId));
              Alert.alert('Success', 'Video deleted successfully');
            } catch (error: any) {
              console.error('Error deleting video:', error);
              
              if (error.message?.includes('Network Error') || error.message?.includes('Network request failed')) {
                Alert.alert('Connection Error', 'Unable to connect to the server. Please check your internet connection and try again.');
              } else {
                Alert.alert('Error', 'Failed to delete video. Please try again later.');
              }
            }
          },
        },
      ]
    );
  };

  const getAuthToken = async (): Promise<string | null> => {
    return await apiService.getAuthToken();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'processing':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVideos();
  };

  const handleAnalyze = (video: Video) => {
    setSelectedVideo(video);
    fetchAnalysisHistory(video._id);
    setShowAnalysisModal(true);
  };

  const handleSendAnalysis = () => {
    if (!currentPrompt.trim() || !selectedVideo) return;

    const prompt = currentPrompt;
    setCurrentPrompt('');
    
    // Add user message to history
    setAnalysisHistory(prev => [...prev, {
      _id: `temp_${Date.now()}`,
      prompt,
      response: 'Analyzing...',
      confidence: 0,
      processingTime: 0,
      status: 'processing',
      createdAt: new Date().toISOString()
    }]);

    // Send to API
    analyzeVideo(selectedVideo._id, prompt);
  };

  const renderVideoItem = ({ item }: { item: Video }) => (
    <View style={styles.videoCard}>
      <View style={styles.videoHeader}>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {item.description || 'No description'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteVideo(item._id)}
        >
          <Ionicons name="trash-outline" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>

      <View style={styles.videoMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.metaText}>
            {new Date(item.uploadDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="hardware-chip-outline" size={16} color="#666" />
          <Text style={styles.metaText}>{formatFileSize(item.fileSize)}</Text>
        </View>
        {item.duration > 0 && (
          <View style={styles.metaItem}>
            <Ionicons name="play-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{formatDuration(item.duration)}</Text>
          </View>
        )}
      </View>

      <View style={styles.videoStatus}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
        <Text style={styles.statusText}>{item.status}</Text>
      </View>

      {item.aiSummary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>AI Summary:</Text>
          <Text style={styles.summaryText} numberOfLines={3}>
            {item.aiSummary}
          </Text>
        </View>
      )}

      <View style={styles.videoActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => handleAnalyze(item)}
        >
          <Ionicons name="chatbubble-outline" size={16} color="white" />
          <Text style={styles.primaryButtonText}>Analyze</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => {
            setSelectedVideo(item);
            fetchAnalysisHistory(item._id);
            setShowHistoryModal(true);
          }}
        >
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.secondaryButtonText}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Videos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('VideoCapture')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {videos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="videocam-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No videos yet</Text>
          <Text style={styles.emptySubtitle}>
            Record or upload your first agricultural video to start analyzing with AI
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('VideoCapture')}
          >
            <Ionicons name="videocam" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Record Video</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Analysis Modal */}
      <Modal
        visible={showAnalysisModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              AI Analysis: {selectedVideo?.title}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAnalysisModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatContainer}>
            {analysisHistory.length === 0 ? (
              <View style={styles.emptyChat}>
                <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                <Text style={styles.emptyChatText}>
                  Start analyzing your video by asking questions
                </Text>
              </View>
            ) : (
              analysisHistory.map((analysis, index) => (
                <View key={analysis._id || index} style={styles.chatMessage}>
                  <View style={styles.userMessage}>
                    <Text style={styles.userMessageText}>{analysis.prompt}</Text>
                  </View>
                  <View style={styles.aiMessage}>
                    <Text style={styles.aiMessageText}>
                      {analysis.status === 'processing' ? 'Analyzing...' : analysis.response}
                    </Text>
                    {analysis.confidence > 0 && (
                      <Text style={styles.confidenceText}>
                        Confidence: {(analysis.confidence * 100).toFixed(1)}%
                      </Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={currentPrompt}
              onChangeText={setCurrentPrompt}
              placeholder="Ask about your video (e.g., 'What crops do you see?')"
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[styles.sendButton, !currentPrompt.trim() && styles.sendButtonDisabled]}
              onPress={handleSendAnalysis}
              disabled={!currentPrompt.trim() || analyzing}
            >
              <Ionicons 
                name={analyzing ? "hourglass-outline" : "send"} 
                size={20} 
                color={currentPrompt.trim() ? "white" : "#ccc"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* History Modal */}
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Analysis History: {selectedVideo?.title}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowHistoryModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.historyContainer}>
            {analysisHistory.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Ionicons name="time-outline" size={48} color="#ccc" />
                <Text style={styles.emptyHistoryText}>No analysis history yet</Text>
              </View>
            ) : (
              analysisHistory.map((analysis, index) => (
                <View key={analysis._id || index} style={styles.historyItem}>
                  <Text style={styles.historyPrompt}>{analysis.prompt}</Text>
                  <Text style={styles.historyResponse}>{analysis.response}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(analysis.createdAt).toLocaleString()}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  listContainer: {
    padding: 15,
  },
  videoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  videoInfo: {
    flex: 1,
    marginRight: 10,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  deleteButton: {
    padding: 5,
  },
  videoMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  videoStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 16,
  },
  videoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
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
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyChatText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  chatMessage: {
    marginBottom: 15,
  },
  userMessage: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 12,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  userMessageText: {
    color: 'white',
    fontSize: 14,
  },
  aiMessage: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginTop: 8,
  },
  aiMessageText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 18,
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
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
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  historyContainer: {
    flex: 1,
    padding: 15,
  },
  emptyHistory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyPrompt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  historyResponse: {
    fontSize: 13,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 11,
    color: '#999',
  },
});

export default VideosScreen; 