import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Fab,
  Snackbar
} from '@mui/material';
import {
  CloudUpload,
  VideoLibrary,
  PlayArrow,
  Delete,
  Chat,
  Send,
  Add,
  Close,
  Refresh,
  Download,
  Visibility
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const VideoSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default,
}));

const UploadArea = styled(Paper)(({ theme, isDragOver }) => ({
  border: `2px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isDragOver ? theme.palette.primary.light + '10' : theme.palette.background.paper,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '10',
  },
}));

const VideoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const VideoAnalysis = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [chatDialog, setChatDialog] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const fileInputRef = useRef();
  const chatEndRef = useRef();

  // Mock API base URL - replace with your actual backend URL
  const API_BASE_URL = 'http://localhost:5001/api';

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      fetchAnalysisHistory(selectedVideo._id);
    }
  }, [selectedVideo]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [analysisHistory]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      } else {
        throw new Error('Failed to fetch videos');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load videos',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysisHistory = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos/${videoId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalysisHistory(data.analyses || []);
      }
    } catch (error) {
      console.error('Error fetching analysis history:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('video/')) {
      setSnackbar({
        open: true,
        message: 'Please select a valid video file',
        severity: 'error'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      formData.append('description', 'Uploaded video for analysis');

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(prev => [data.video, ...prev]);
        setUploadDialog(false);
        setSnackbar({
          open: true,
          message: 'Video uploaded successfully!',
          severity: 'success'
        });
        fetchVideos(); // Refresh the list
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to upload video',
        severity: 'error'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAnalyzeVideo = async (videoId, prompt, analysisType = 'question') => {
    setAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos/${videoId}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          analysisType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add to analysis history
        setAnalysisHistory(prev => [...prev, data.analysis]);
        
        // Update video list if summary was generated
        if (analysisType === 'summary' && data.success) {
          fetchVideos();
        }

        setSnackbar({
          open: true,
          message: data.success ? 'Analysis completed!' : 'Analysis failed',
          severity: data.success ? 'success' : 'error'
        });
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to analyze video',
        severity: 'error'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setVideos(prev => prev.filter(video => video._id !== videoId));
        if (selectedVideo?._id === videoId) {
          setSelectedVideo(null);
          setChatDialog(false);
        }
        setSnackbar({
          open: true,
          message: 'Video deleted successfully',
          severity: 'success'
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete video',
        severity: 'error'
      });
    }
  };

  const handleSendMessage = () => {
    if (!currentPrompt.trim() || !selectedVideo) return;

    const prompt = currentPrompt;
    setCurrentPrompt('');
    
    // Add user message to history
    setAnalysisHistory(prev => [...prev, {
      prompt,
      response: 'Analyzing...',
      status: 'processing',
      createdAt: new Date().toISOString()
    }]);

    // Send to API
    handleAnalyzeVideo(selectedVideo._id, prompt);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <VideoSection>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 2 }}>
          🎥 Video Analysis
        </Typography>
        <Typography variant="h5" color="text.secondary" align="center" sx={{ mb: 6 }}>
          Upload and analyze agricultural videos with AI
        </Typography>

        {/* Upload Section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Upload New Video</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setUploadDialog(true)}
            >
              Upload Video
            </Button>
          </Box>
          
          {uploading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Video Gallery */}
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <LinearProgress sx={{ width: '100%' }} />
              </Box>
            </Grid>
          ) : videos.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <VideoLibrary sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No videos uploaded yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload your first agricultural video to start analyzing with AI
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setUploadDialog(true)}
                >
                  Upload First Video
                </Button>
              </Paper>
            </Grid>
          ) : (
            videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video._id}>
                <VideoCard>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3" noWrap>
                        {video.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteVideo(video._id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {video.description || 'No description'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={video.status}
                        color={video.status === 'completed' ? 'success' : 'warning'}
                        size="small"
                      />
                      <Chip
                        label={formatFileSize(video.fileSize)}
                        variant="outlined"
                        size="small"
                      />
                      {video.duration > 0 && (
                        <Chip
                          label={formatDuration(video.duration)}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Box>
                    
                    {video.aiSummary && (
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {video.aiSummary}
                      </Typography>
                    )}
                    
                    <Typography variant="caption" color="text.secondary">
                      Uploaded: {new Date(video.uploadDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<Chat />}
                      onClick={() => {
                        setSelectedVideo(video);
                        setChatDialog(true);
                      }}
                    >
                      Analyze
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => {
                        setSelectedVideo(video);
                        setChatDialog(true);
                      }}
                    >
                      View
                    </Button>
                  </CardActions>
                </VideoCard>
              </Grid>
            ))
          )}
        </Grid>

        {/* Upload Dialog */}
        <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogContent>
            <UploadArea
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Drop video file here or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports MP4, AVI, MOV, WebM (Max 100MB)
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </UploadArea>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Chat Dialog */}
        <Dialog 
          open={chatDialog} 
          onClose={() => setChatDialog(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{ sx: { height: '80vh' } }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                AI Analysis: {selectedVideo?.title}
              </Typography>
              <IconButton onClick={() => setChatDialog(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Analysis History */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
              {analysisHistory.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Chat sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Start analyzing your video
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ask questions about your agricultural video or request a summary
                  </Typography>
                </Box>
              ) : (
                <List>
                  {analysisHistory.map((analysis, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant="subtitle2" color="primary">
                                You: {analysis.prompt}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {analysis.status === 'processing' ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinearProgress sx={{ width: 100 }} />
                                    Analyzing...
                                  </Box>
                                ) : (
                                  analysis.response
                                )}
                              </Typography>
                              {analysis.confidence && (
                                <Chip
                                  label={`Confidence: ${(analysis.confidence * 100).toFixed(1)}%`}
                                  size="small"
                                  color={analysis.confidence > 0.7 ? 'success' : 'warning'}
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </Box>
                          }
                          secondary={new Date(analysis.createdAt).toLocaleString()}
                        />
                      </ListItem>
                      {index < analysisHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  <div ref={chatEndRef} />
                </List>
              )}
            </Box>
            
            {/* Input Area */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Ask about your video (e.g., 'What crops do you see?' or 'Are there any signs of disease?')"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={analyzing}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!currentPrompt.trim() || analyzing}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <Send />
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </VideoSection>
  );
};

export default VideoAnalysis; 