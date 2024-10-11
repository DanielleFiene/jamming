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
        sx={{
          fontSize: {
            xs: '1.5em', // for extra small screens
            sm: '2em',   // for small screens
            md: '2.5em', // for medium screens
            lg: '3em',   // for large screens
            xl: '3.5em', // for extra large screens
          },
          letterSpacing: {
            xs: '0.3em',
            sm: '0.5em',
            md: '0.7em',
            lg: '0.8em',
            xl: '1em',
          },
          fontWeight: '800',
          textAlign: 'center', // center the text
        }}
      >
        JAMMING
      </Typography>
    </Box>
  );
};

export default Header;
