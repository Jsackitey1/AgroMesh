import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Agriculture as AgricultureIcon,
  Business as BusinessIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';

const SolutionCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const SolutionIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 48,
    color: theme.palette.primary.main,
  },
}));

const solutions = [
  {
    icon: <AgricultureIcon />,
    title: 'For Farmers',
    description: 'Empower smallholder farmers with real-time environmental data and AI-powered insights. Our solution includes:',
    features: [
      'Smart irrigation recommendations based on soil moisture and weather forecasts',
      'Early warning system for pest and disease outbreaks',
      'Crop-specific yield predictions and harvest timing',
      'SMS alerts in local languages for critical updates',
      'Offline-first mobile app for areas with limited connectivity'
    ]
  },
  {
    icon: <BusinessIcon />,
    title: 'For Businesses',
    description: 'Enable agricultural businesses to optimize operations and scale their impact. Our solution offers:',
    features: [
      'Supply chain optimization through predictive analytics',
      'Resource allocation based on real-time field conditions',
      'Quality control through environmental monitoring',
      'Integration with existing farm management systems',
      'Customizable dashboards for business intelligence'
    ]
  },
  {
    icon: <ScienceIcon />,
    title: 'For Researchers',
    description: 'Support agricultural research and development with comprehensive data collection. Our platform provides:',
    features: [
      'High-resolution environmental data for research studies',
      'API access for custom analytics and models',
      'Collaborative tools for multi-location research',
      'Data export in multiple formats for analysis',
      'Integration with popular research platforms'
    ]
  }
];

const Solutions = () => {
  return (
    <Box id="solutions" sx={{ py: 8, bgcolor: 'background.paper', scrollMarginTop: '64px' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
          Our Solutions
        </Typography>
        <Grid container spacing={4}>
          {solutions.map((solution, index) => (
            <Grid item xs={12} md={4} key={index}>
              <SolutionCard>
                <CardContent sx={{ flexGrow: 1 }}>
                  <SolutionIcon>
                    {solution.icon}
                  </SolutionIcon>
                  <Typography variant="h5" component="h3" gutterBottom align="center">
                    {solution.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {solution.description}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 2 }}>
                    {solution.features.map((feature, idx) => (
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
              </SolutionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Solutions; 