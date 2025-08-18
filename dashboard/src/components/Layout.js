import React from 'react';
import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import Home from './Home';
import About from './About';
import Blog from './Blog';
import Contact from './Contact';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
