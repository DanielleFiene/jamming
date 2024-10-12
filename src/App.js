// App.js
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Header from './components/Header';
import { Container, Grid, Box, Button } from '@mui/material';
import { loginWithSpotify, getAccessToken, refreshToken } from './components/SpotifyAuth';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import { theme, GlobalScrollbarStyles } from './styles/StyleOverrides.js';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import './styles/style.css';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [refreshTokenValue, setRefreshTokenValue] = useState('');

  const navigate = useNavigate();

  // Function to log in with Spotify
  const handleLogin = () => {
    loginWithSpotify(); // Redirects user to Spotify login
  };

  // Function to log out
  const handleLogout = () => {
    setAccessToken('');
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('spotifyRefreshToken');
    setSearchResults([]);
    setPlaylist([]);
    navigate('/');
  };

  // Function to refresh access token using refresh token
  const refreshAccessToken = async () => {
    try {
      const newAccessToken = await refreshToken(refreshTokenValue);
      setAccessToken(newAccessToken);
      localStorage.setItem('spotifyAccessToken', newAccessToken);
    } catch (error) {
      console.error('Error refreshing access token:', error);
      handleLogout();
    }
  };

  // Function to save the playlist to Spotify
  const saveToSpotify = async (playlistName, trackUris) => {
    if (!accessToken) {
      alert('You need to log in to save playlists to Spotify.');
      return;
    }

    try {
      // Get user ID
      const userIdResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const userId = userIdResponse.data.id;

      // Create playlist
      const createPlaylistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName,
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Add tracks to the newly created playlist
      await axios.post(
        `https://api.spotify.com/v1/playlists/${createPlaylistResponse.data.id}/tracks`,
        {
          uris: trackUris,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert('Playlist saved to Spotify successfully!');
    } catch (error) {
      console.error('Error saving playlist to Spotify:', error);
      if (error.response && error.response.status === 401) {
        // If the token expired, refresh it
        await refreshAccessToken();
        saveToSpotify(playlistName, trackUris); // Retry saving
      } else {
        alert('Failed to save the playlist to Spotify.');
      }
    }
  };

  // Function to handle saving playlist when user clicks the button
  const handleSavePlaylist = () => {
    if (playlist.length === 0) {
      alert('Add some tracks to your playlist first!');
      return;
    }

    const trackUris = playlist.map((track) => track.uri);
    saveToSpotify('My Custom Playlist', trackUris);
  };

  // Function to retrieve token from localStorage and refresh if needed
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('spotifyAccessToken');
    const storedRefreshToken = localStorage.getItem('spotifyRefreshToken');

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }

    if (storedRefreshToken) {
      setRefreshTokenValue(storedRefreshToken);
    }

    // Removed automatic login trigger
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalScrollbarStyles />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to right, #bbd2c5, #536976, #292e49)',
        }}
      >
        <Header handleLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                accessToken={accessToken}
                handleLogin={handleLogin}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                playlist={playlist}
                setPlaylist={setPlaylist}
                handleSavePlaylist={handleSavePlaylist}
                handleLogout={handleLogout}
              />
            }
          />
          <Route
            path="/callback"
            element={<AuthCallback setAccessToken={setAccessToken} setRefreshToken={setRefreshTokenValue} />}
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

const Home = ({
  accessToken,
  handleLogin,
  searchResults,
  setSearchResults,
  playlist,
  setPlaylist,
  handleSavePlaylist,
  handleLogout,
}) => {
  return (
    <Container
      sx={{
        background: 'linear-gradient(to right, #536976, #292e49)',
        boxShadow: '0px 0px 40px 20px rgba(0, 0, 0, 0.7)',
        marginTop: '1%',
        paddingTop: '2%',
        maxHeight: '100%',
        height: {
          xs: '90vh',
          sm: '90vh',
          md: '90vh',
          lg: '85vh',
          xl: '85vh',
        },
        width: {
          xs: '90%',
          sm: '90%',
          md: '90%',
        },
        borderRadius: {
          xs: '8px',
          sm: '40px',
          md: '15%',
          lg: '15%',
          xl: '15%',
        },
      }}
    >
      <Grid
        container
        spacing={{
          xs: 1,
          sm: 2,
          md: 3,
        }}
        sx={{
          height: {
            xs: '80vh',
            sm: '75vh',
            md: '85vh',
          },
          width: {
            xs: '100%',
            sm: '100%',
            md: '100%',
          },
          marginTop: {
            xs: '50px',
            sm: '20px',
            md: '20px',
            lg: '20px',
            xl: '-60px',
          },
          justifyContent: {
            xs: 'flex-start',
            sm: 'center',
          },
          alignItems: 'flex-start',
        }}
      >

        {!accessToken ? (
          <Grid item xs={12} sm={6}>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: '20%' }}>
              <Button variant="outlined" onClick={handleLogin}>
                Log in with Spotify
              </Button>
              <PlayCircleIcon
                sx={{
                  fontSize: { xs: '10em', sm: '15em', md: '30em' },
                  marginTop: { xs: '20%', sm: '45%', lg: '25%' },
                  color: 'primary.main',
                  boxShadow: '0px 0px 40px 20px rgba(0, 0, 0, 0.7)',
                  borderRadius: '4px',
                }}
              />
            </Box>
          </Grid>
        ) : (
          <Grid container spacing={2} item xs={12}>
            <Box display="flex" justifyContent="space-between" sx={{ width: '100%', marginTop: '3%' }}>
              <Grid
                item
                xs={12} sm={6}
                sx={{
                  padding: '0 15px',
                  maxHeight: '75vh',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                }}
              >
                <SearchBar setSearchResults={setSearchResults} accessToken={accessToken} />
                <SearchResults searchResults={searchResults} playlist={playlist} setPlaylist={setPlaylist} />
              </Grid>
              <Grid
                item
                xs={12} sm={6}
                sx={{
                  padding: '0 15px',
                  maxHeight: '75vh',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                }}
              >
                <Playlist playlist={playlist} setPlaylist={setPlaylist} accessToken={accessToken} />
              </Grid>
            </Box>
          </Grid>
        )}

        {accessToken && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '10px',
              marginBottom: '10px',
            }}
          >
            <Button variant="outlined" onClick={handleSavePlaylist}>
              Save Playlist to Spotify
            </Button>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

const AuthCallback = ({ setAccessToken, setRefreshToken }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');

    if (code) {
      getAccessToken(code)
        .then((data) => {
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          localStorage.setItem('spotifyAccessToken', data.access_token);
          localStorage.setItem('spotifyRefreshToken', data.refresh_token);
          navigate('/');
        })
        .catch((error) => {
          console.error('Error during authentication', error);
        });
    }
  }, [location, navigate, setAccessToken, setRefreshToken]);

  return <h2>Loading...</h2>;
};

export default App;
