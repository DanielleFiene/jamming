import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
    },
    primary: {
      main: '#1DB954', // Spotify green for the primary color
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(120deg, #1DB954, #191414)', // Spotify gradient color
          color: '#ffffff',
          fontWeight: '600',
          borderRadius: '20px',
          padding: '8px 24px',
          textTransform: 'uppercase',
          transition: 'ease-in, 0.3s',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)',
          '&:hover': {
            scale: '1.05',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#1DB954', // Default Spotify green icon color
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Stronger hover effect
          },
        },
      },
    },
  },
});

export default theme;
