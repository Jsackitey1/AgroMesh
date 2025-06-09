import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Avatar, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowForward as ArrowForwardIcon,
  Science as ScienceIcon,
  Devices as DevicesIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const AboutSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default,
}));

const TeamMemberCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(3),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 200,
  height: 200,
  marginBottom: theme.spacing(2),
  border: `4px solid ${theme.palette.primary.main}`,
}));

const NavigationButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontSize: '1rem',
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
}));

const LinkedInButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.dark,
  },
}));

const About = () => {
  const teamMembers = [
    {
      name: 'Joseph Sackitey',
      role: 'Project Lead & Developer',
      image: '/Assets/Joseph-Sackitey.jpeg',
      bio: 'Leading the development of AgroMesh with a focus on creating sustainable agricultural solutions for farmers worldwide.',
      linkedin: 'https://www.linkedin.com/in/joseph-sackitey/'
    },
    {
      name: 'Andrew Agyemang Duah',
      role: 'Co-Developer & Technical Advisor',
      image: '/Assets/Andrews Agyemang Duah.jpg',
      bio: 'Contributing technical expertise and innovative solutions to make AgroMesh accessible and effective for farmers.',
      linkedin: 'https://www.linkedin.com/in/andrews-agyemang-duah-6a01b1289/'
    }
  ];

  const handleNavigation = (section) => {
    // Navigate to home page and then scroll to section
    window.location.href = `/#${section}`;
  };

  return (
    <AboutSection>
      <Container maxWidth="lg">
        {/* Project Overview */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 4 }}>
            About AgroMesh
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph align="center" sx={{ mb: 4 }}>
            Empowering Farmers Through Technology
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8 }}>
            AgroMesh is a groundbreaking initiative born from a vision to revolutionize agricultural practices in underserved regions. 
            Our project combines cutting-edge technology with practical farming knowledge to create a sustainable, 
            solar-powered network of environmental sensors that help farmers optimize their crop yield and resource usage.
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8 }}>
            What sets AgroMesh apart is our commitment to accessibility and community-driven development. 
            We're building an open-source platform that can be adapted to local needs, with support for multiple languages 
            and offline functionality for areas with limited connectivity. Our AI-powered analytics provide actionable insights 
            for irrigation, pest control, and harvest timing, while our solar-powered sensors ensure sustainable operation 
            in remote locations.
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
            As we continue to develop and refine AgroMesh, our goal remains clear: to empower farmers with the tools 
            they need to thrive in an increasingly challenging agricultural landscape. Through collaboration with farmers, 
            researchers, and technology experts, we're creating a solution that's not just innovative, but truly impactful 
            for communities worldwide.
          </Typography>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <NavigationButton
              variant="contained"
              color="primary"
              startIcon={<ScienceIcon />}
              onClick={() => handleNavigation('solutions')}
            >
              Explore Our Solutions
            </NavigationButton>
            <NavigationButton
              variant="outlined"
              color="primary"
              startIcon={<DevicesIcon />}
              onClick={() => handleNavigation('technologies')}
            >
              View Our Technologies
            </NavigationButton>
          </Box>
        </Box>

        {/* Team Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
            Meet the Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <TeamMemberCard>
                  <StyledAvatar
                    src={member.image}
                    alt={member.name}
                  />
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                    {member.linkedin && (
                      <LinkedInButton
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<LinkedInIcon />}
                      >
                        LinkedIn
                      </LinkedInButton>
                    )}
                  </CardContent>
                </TeamMemberCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </AboutSection>
  );
};

export default About; 