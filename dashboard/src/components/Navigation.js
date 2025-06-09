import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const pages = [
  { 
    title: 'Solutions', 
    href: '#solutions',
    path: '/',
    onClick: (navigate) => {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector('#solutions');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  },
  { 
    title: 'Technologies', 
    href: '#technologies',
    path: '/',
    onClick: (navigate) => {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector('#technologies');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  },
  { title: 'About', path: '/about' },
  { title: 'Blog', path: '/blog' },
  { title: 'Contact', path: '/contact' },
];

const Navigation = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavClick = (page) => {
    handleCloseNavMenu();
    if (page.onClick) {
      page.onClick(navigate);
    } else if (page.path) {
      navigate(page.path);
    }
  };

  const isActive = (page) => {
    if (page.path) {
      return location.pathname === page.path;
    }
    return false;
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            AgroMesh
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.title} 
                  onClick={() => handleNavClick(page)}
                >
                  <Typography 
                    textAlign="center"
                    sx={{ 
                      color: isActive(page) ? 'primary.main' : 'inherit',
                      fontWeight: isActive(page) ? 600 : 400,
                    }}
                  >
                    {page.title}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            AgroMesh
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => handleNavClick(page)}
                sx={{ 
                  mx: 1, 
                  color: isActive(page) ? 'primary.main' : 'text.primary',
                  display: 'block',
                  fontWeight: isActive(page) ? 600 : 400,
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Right side - Get Started button */}
          <Box sx={{ display: 'flex' }}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/about"
              sx={{ ml: 2, display: { xs: 'none', md: 'block' } }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation; 