import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  WaterDrop as WaterDropIcon,
  WbSunny as SunIcon,
  Cloud as CloudIcon,
  BugReport as BugIcon,
  Analytics as AnalyticsIcon,
  Language as LanguageIcon
} from '@mui/icons-material';

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 48,
    color: theme.palette.primary.main,
  },
}));

const features = [
  {
    icon: <WaterDropIcon />,
    title: 'Soil Health Monitoring',
    description: 'Real-time monitoring of soil moisture, pH, and nutrient levels to optimize crop growth.',
  },
  {
    icon: <CloudIcon />,
    title: 'Weather Tracking',
    description: 'Comprehensive weather monitoring including temperature, humidity, and rainfall patterns.',
  },
  {
    icon: <SunIcon />,
    title: 'Solar-Powered',
    description: 'Sustainable, low-maintenance sensor nodes powered by solar energy.',
  },
  {
    icon: <BugIcon />,
    title: 'Pest Risk Alerts',
    description: 'AI-powered predictions for pest and disease outbreaks based on environmental conditions.',
  },
  {
    icon: <AnalyticsIcon />,
    title: 'Smart Analytics',
    description: 'Advanced analytics and forecasting for irrigation needs and yield predictions.',
  },
  {
    icon: <LanguageIcon />,
    title: 'Local Language Support',
    description: 'SMS alerts and interface available in multiple local languages.',
  },
];

const Features = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
          Our Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <FeatureIcon>
                    {feature.icon}
                  </FeatureIcon>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features; 