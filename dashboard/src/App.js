import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green shade for agricultural theme
    },
    secondary: {
      main: '#FFA000', // Amber shade for alerts/warnings
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AgroMesh Dashboard
            </Typography>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to AgroMesh
          </Typography>
          <Typography variant="body1" paragraph>
            Monitor your farm's environmental conditions in real-time.
          </Typography>
          
          {/* Dashboard content will go here */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 3,
            mt: 4 
          }}>
            {/* Placeholder for sensor cards */}
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="h6">Soil Moisture</Typography>
              <Typography variant="body2" color="text.secondary">
                Loading sensor data...
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="h6">Temperature</Typography>
              <Typography variant="body2" color="text.secondary">
                Loading sensor data...
              </Typography>
            </Box>
            
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="h6">Humidity</Typography>
              <Typography variant="body2" color="text.secondary">
                Loading sensor data...
              </Typography>
            </Box>
          </Box>
        </Container>
        
        <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} AgroMesh - Smart Agricultural Monitoring
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 