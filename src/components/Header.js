// components/Header.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '20px 20px',
        background: 'transparent',
        color: '#ffffff',
      }}
    >
      <Typography 
        variant="h5" 
        component="h1" 
        sx={{ fontSize: '2em', letterSpacing: '0.8em', fontWeight: '800' }}
      >
        JAMMING
      </Typography>
    </Box>
  );
};

export default Header;
