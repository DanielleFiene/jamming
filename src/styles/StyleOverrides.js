import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

const theme = createTheme({
  palette: {
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
    },
    primary: {
      main: '#1DB954',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(120deg, #1DB954, #191414)',
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
            opacity: 0.5,
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
          color: '#1DB954',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
      width: '12px',
      backgroundColor: 'transparent',
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent',
      borderRadius: '8px',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#BBD2C5',
      borderRadius: '8px',
    },
    '::-webkit-scrollbar-button': {
      display: 'none',
    },
    '::-webkit-scrollbar-thumb:hover': {
      opacity: '0.8',
    },
    // Specifically target the scrollable areas
    '.MuiGrid-root::-webkit-scrollbar': {
      width: '12px',
    },
    '.MuiGrid-root::-webkit-scrollbar-thumb': {
      backgroundImage: 'linear-gradient(to bottom, #ffe259, #ffa751)',
      borderRadius: '8px',
    },
    // Media query for small screens
    '@media (max-width:600px)': {
      '::-webkit-scrollbar': {
        width: '4px', // Set scrollbar width to 4px for small screens
      },
      '.MuiGrid-root::-webkit-scrollbar': {
        width: '4px',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#BBD2C5', // Optionally adjust thumb color for small screens
      },
      '.MuiGrid-root::-webkit-scrollbar-thumb': {
        backgroundImage: 'linear-gradient(to bottom, #ffe259, #ffa751)', // Keep the gradient for thumb
      },
    },
  }} />
);

export { theme, GlobalScrollbarStyles };
