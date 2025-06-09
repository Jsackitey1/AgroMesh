import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/Assets/farmer-on a farm.jpg")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  color: 'white',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const Hero = () => {
  return (
    <HeroSection>
      <Container maxWidth="lg">
        <HeroContent>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 3
                }}
              >
                Empowering Farmers with Smart Technology
              </Typography>
              <Typography 
                variant="h5" 
                paragraph 
                sx={{ 
                  mb: 4,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  lineHeight: 1.6
                }}
              >
                A decentralized, solar-powered network of environmental sensors helping farmers worldwide optimize crop yield, resource usage, and resilience to climate variability.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  component={RouterLink}
                  to="/about"
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
          </Grid>
        </HeroContent>
      </Container>
    </HeroSection>
  );
};

export default Hero; 