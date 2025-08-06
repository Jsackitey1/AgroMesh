import React from 'react';
import { Box, Container, Typography, Paper, Button, Card, CardContent, CardActions, Chip, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Newspaper, Download, Android, Smartphone, Agriculture } from '@mui/icons-material';

const BlogSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default,
}));

const BlogCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
  },
}));

const Blog = () => {
  const handleDownloadApp = () => {
    window.open('https://expo.dev/accounts/sackjo02/projects/agromesh-mobile/builds/4eff0d15-268f-4702-8c10-ef84895f0696', '_blank');
  };

  return (
    <BlogSection>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 2 }}>
          AgroMesh Blog
        </Typography>
        <Typography variant="h5" color="text.secondary" align="center" sx={{ mb: 6 }}>
          Insights, Updates, and Stories from the Field
        </Typography>

        <Grid container spacing={4}>
          {/* First Blog Post - Android App Release */}
          <Grid item xs={12} md={8}>
            <BlogCard>
              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    icon={<Android />} 
                    label="Mobile App" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  🚀 AgroMesh Android App Now Available for Testing!
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                  We're excited to announce that the AgroMesh mobile application is now ready for testing! 
                  After months of development and rigorous testing, we've successfully built a comprehensive 
                  smart farming solution that brings real-time monitoring and AI-powered insights directly to your smartphone.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  ✨ What's Included in This Release:
                </Typography>
                
                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                    <strong>User Authentication:</strong> Secure registration and login system
                  </Typography>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                    <strong>Real-time Dashboard:</strong> Live monitoring of sensor data and farm metrics
                  </Typography>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                    <strong>Sensor Management:</strong> View and manage connected IoT sensors
                  </Typography>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                    <strong>AI-Powered Insights:</strong> Get intelligent recommendations for crop management
                  </Typography>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                    <strong>Alert System:</strong> Real-time notifications for critical farm events
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                  This beta version represents a significant milestone in our mission to democratize smart farming technology. 
                  We've focused on creating an intuitive, user-friendly interface that makes advanced agricultural monitoring 
                  accessible to farmers of all technical levels.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
                  🎯 How to Test the App:
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                  Simply click the download button below to access the Android APK file. The app is designed to work seamlessly 
                  with our backend infrastructure, providing a complete smart farming experience. We encourage all users to 
                  provide feedback as we continue to refine and enhance the application.
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 3 }}>
                  Note: This is a beta release intended for testing purposes. Please report any issues or suggestions 
                  through our feedback channels.
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 4, pt: 0 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Download />}
                  onClick={handleDownloadApp}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Download Android App
                </Button>
              </CardActions>
            </BlogCard>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  📱 App Information
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Version:</strong> 1.0.0 (Beta)
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Platform:</strong> Android
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Build Date:</strong> July 31, 2025
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Size:</strong> ~25MB
                </Typography>
              </Paper>


            </Box>
          </Grid>
        </Grid>
      </Container>
    </BlogSection>
  );
};

export default Blog; 