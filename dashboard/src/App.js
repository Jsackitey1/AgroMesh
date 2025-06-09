import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green shade for agricultural theme
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FFA000', // Amber shade for alerts/warnings
      light: '#FFB74D',
      dark: '#F57C00',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navigation />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Hero />
          <Features />
          {/* Additional sections will be added here */}
        </Box>
        <Box component="footer" sx={{ py: 4, bgcolor: 'background.paper' }}>
          <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2, textAlign: 'center' }}>
            <Box sx={{ mb: 2 }}>
              {/* Add social media icons here */}
            </Box>
            <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
              © {new Date().getFullYear()} AgroMesh - Smart Agricultural Monitoring Network
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 