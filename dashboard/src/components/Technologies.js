import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Sensors as SensorsIcon,
  Psychology as PsychologyIcon,
  PhoneAndroid as MobileIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const TechCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const TechIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 48,
    color: theme.palette.primary.main,
  },
}));

const technologies = [
  {
    icon: <SensorsIcon />,
    title: 'Sensor Network',
    description: 'Our advanced sensor network provides comprehensive environmental monitoring:',
    features: [
      'Solar-powered, low-maintenance sensor nodes',
      'LoRaWAN and WiFi connectivity options',
      'Real-time soil moisture, temperature, and humidity monitoring',
      'Weather station integration for microclimate analysis',
      'Expandable sensor array for custom measurements'
    ],
    status: 'In Development'
  },
  {
    icon: <PsychologyIcon />,
    title: 'AI Analytics',
    description: 'Leveraging machine learning for predictive agriculture:',
    features: [
      'Crop-specific yield prediction models',
      'Pest and disease outbreak forecasting',
      'Irrigation optimization algorithms',
      'Climate adaptation recommendations',
      'Anomaly detection for early warning'
    ],
    status: 'In Development'
  },
  {
    icon: <MobileIcon />,
    title: 'Mobile Application',
    description: 'User-friendly mobile interface for farmers:',
    features: [
      'Offline-first design for limited connectivity',
      'Multi-language support with local dialects',
      'Push notifications for critical alerts',
      'Field mapping and sensor management',
      'Crop calendar and task scheduling'
    ],
    status: 'In Development'
  },
  {
    icon: <CloudIcon />,
    title: 'Cloud Platform',
    description: 'Robust backend infrastructure for data management:',
    features: [
      'Real-time data processing and storage',
      'Scalable microservices architecture',
      'RESTful API for third-party integration',
      'Automated backup and recovery',
      'Global CDN for fast content delivery'
    ],
    status: 'In Development'
  },
  {
    icon: <StorageIcon />,
    title: 'Data Analytics',
    description: 'Advanced analytics and reporting capabilities:',
    features: [
      'Customizable dashboards and reports',
      'Historical data analysis and trends',
      'Export functionality in multiple formats',
      'Collaborative research tools',
      'Integration with popular analytics platforms'
    ],
    status: 'In Development'
  },
  {
    icon: <SecurityIcon />,
    title: 'Security & Privacy',
    description: 'Enterprise-grade security for data protection:',
    features: [
      'End-to-end encryption for all data',
      'Role-based access control',
      'GDPR and local compliance support',
      'Regular security audits',
      'Secure API authentication'
    ],
    status: 'In Development'
  }
];

const Technologies = () => {
  return (
    <Box id="technologies" sx={{ py: 8, bgcolor: 'background.default', scrollMarginTop: '64px' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
          Our Technologies
        </Typography>
        <Grid container spacing={4}>
          {technologies.map((tech, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <TechCard>
                <CardContent sx={{ flexGrow: 1 }}>
                  <TechIcon>
                    {tech.icon}
                  </TechIcon>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h3">
                      {tech.title}
                    </Typography>
                    <Chip 
                      label={tech.status} 
                      size="small"
                      color="primary"
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {tech.description}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 2 }}>
                    {tech.features.map((feature, idx) => (
                      <Typography
                        component="li"
                        variant="body2"
                        color="text.secondary"
                        key={idx}
                        sx={{ mb: 1 }}
                      >
                        {feature}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </TechCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Technologies; 