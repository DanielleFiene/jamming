import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

const theme = createTheme({
  palette: {
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
    },
    primary: {
      main: '#1DB954', // Spotify green for the primary color, this color will override MUI textfield components border color on active
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
          '&.Mui-disabled': {
            background: 'linear-gradient(120deg, #1DB954, #191414)',
            opacity: 0.5, // Optionally make it semi-transparent
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none',
          },
        },
        outlined: {
          color: '#ffffff',
          fontWeight: '600',
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

// Add GlobalStyles for custom scrollbar styles
const GlobalScrollbarStyles = () => (
  <GlobalStyles styles={{
    '::-webkit-scrollbar': {
      width: '12px', // Width of the scrollbar
      backgroundColor: 'transparent', // Set transparent background to remove default styling
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent', // Transparent background for the track
      borderRadius: '8px', // Rounded corners for the track
    },
    '::-webkit-scrollbar-thumb': {
      background: '#BBD2C5', 
      borderRadius: '8px', // Rounded corners for the thumb
    },
    '::-webkit-scrollbar-button': {
      display: 'none', // Hide the up and down arrows
    },
    '::-webkit-scrollbar-thumb:hover': {
      opacity: '0.8', // Slightly fade the thumb on hover
    },
    // Specifically target the scrollable areas
    '.MuiGrid-root::-webkit-scrollbar': {
      width: '12px',
    },
    '.MuiGrid-root::-webkit-scrollbar-thumb': {
      backgroundImage: 'linear-gradient(to bottom, #ffe259, #ffa751)', // Gradient color for the thumb
      borderRadius: '8px', // Rounded corners for the thumb
    },
  }} />
);

export { theme, GlobalScrollbarStyles };
