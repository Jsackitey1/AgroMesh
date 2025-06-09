import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const FooterSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6, 0),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  display: 'block',
  marginBottom: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const Footer = () => {
  const navigate = useNavigate();

  const handleSectionClick = (sectionId) => {
    // Navigate to home page first
    navigate('/');
    // Use setTimeout to ensure the page has loaded before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <FooterSection>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Section */}
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            <FooterLink component={RouterLink} to="/about">
              About Us
            </FooterLink>
            <FooterLink component={RouterLink} to="/blog">
              Blog
            </FooterLink>
            <FooterLink component={RouterLink} to="/contact">
              Contact
            </FooterLink>
          </Grid>

          {/* Solutions Section */}
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Our Solutions
            </Typography>
            <FooterLink onClick={() => handleSectionClick('solutions')}>
              Solutions
            </FooterLink>
            <FooterLink onClick={() => handleSectionClick('technologies')}>
              Technologies
            </FooterLink>
            <FooterLink onClick={() => handleSectionClick('features')}>
              Features
            </FooterLink>
          </Grid>
        </Grid>

        {/* Contact and Copyright Section */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Gettysburg, PA
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  © {new Date().getFullYear()} AgroMesh. All rights reserved.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </FooterSection>
  );
};

export default Footer; 