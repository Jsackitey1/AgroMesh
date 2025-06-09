import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Email, Send } from '@mui/icons-material';

const ContactSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default,
}));

const ContactForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: '0 auto',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
}));

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error'
      });
      return;
    }

    // Create mailto link
    const mailtoLink = `mailto:sackiteyjoseph44@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    // Open default email client
    window.location.href = mailtoLink;

    // Show success message
    setSnackbar({
      open: true,
      message: 'Opening your email client...',
      severity: 'success'
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ContactSection>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 2 }}>
          Contact Us
        </Typography>
        <Typography variant="h5" color="text.secondary" align="center" sx={{ mb: 6 }}>
          Get in touch with our team
        </Typography>

        <ContactForm elevation={0}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Email sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h6">
                Send us a message
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Your Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              helperText="We'll use this to respond to your message"
            />

            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={4}
              helperText="Please provide details about your inquiry"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              startIcon={<Send />}
              sx={{ mt: 3 }}
            >
              Send Message
            </Button>
          </Box>
        </ContactForm>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ContactSection>
  );
};

export default Contact; 