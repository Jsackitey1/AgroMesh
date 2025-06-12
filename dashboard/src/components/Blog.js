import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Newspaper } from '@mui/icons-material';

const BlogSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(8, 0),
  
  backgroundColor: theme.palette.background.default,
}));

const ComingSoonPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  maxWidth: 600,
  margin: '0 auto',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
}));

const Blog = () => {
  return (
    <BlogSection>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 2 }}>
          AgroMesh Blog
        </Typography>
        <Typography variant="h5" color="text.secondary" align="center" sx={{ mb: 6 }}>
          Insights, Updates, and Stories from the Field
        </Typography>

        <ComingSoonPaper elevation={0}>
          <Newspaper sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We're working on bringing you insightful articles about smart agriculture, 
            technology innovations, and success stories from the field.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stay tuned for our upcoming blog posts!
          </Typography>
        </ComingSoonPaper>
      </Container>
    </BlogSection>
  );
};

export default Blog; 