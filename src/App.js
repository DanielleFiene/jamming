import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Header from './components/Header';  // Import the Header component
import { Container, Grid, Box, Button } from '@mui/material';
import { loginWithSpotify, getAccessToken } from './components/SpotifyAuth';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import { theme, GlobalScrollbarStyles } from './styles/StyleOverrides.js'; // Import the GlobalScrollbarStyles
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import './styles/style.css';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  // Function to log in with Spotify
  const handleLogin = () => {
    loginWithSpotify();  // Redirects user to Spotify login
  };

  // Function to log out
  const handleLogout = () => {
    setAccessToken('');  // Clear the access token
    localStorage.removeItem('spotifyAccessToken');  // Remove token from local storage
    setSearchResults([]);  // Clear search results
    setPlaylist([]);  // Clear the playlist
  };

  // Function to save the playlist to Spotify
  const saveToSpotify = async (playlistName, trackUris) => {
    if (!accessToken) return;

    try {
      // Get user ID
      const userId = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Create playlist
      const createPlaylistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId.data.id}/playlists`,
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
      alert('Failed to save the playlist to Spotify.');
    }
  };

  // Function to handle saving playlist when user clicks the button
  const handleSavePlaylist = () => {
    if (playlist.length === 0) {
      alert("Add some tracks to your playlist first!");
      return;
    }

    const trackUris = playlist.map(track => track.uri); // Extract URIs from tracks
    saveToSpotify('My Custom Playlist', trackUris);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalScrollbarStyles /> {/* Include the GlobalScrollbarStyles here */}
      <Box 
        sx={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(to right, #bbd2c5, #536976, #292e49)',
        }}
      >
        <Router>
          <Header handleLogout={handleLogout} /> {/* Added Header here */}
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
                  handleLogout={handleLogout}  // Pass handleLogout to Home
                />
              }
            />
            <Route path="/callback" element={<Callback setAccessToken={setAccessToken} />} />
          </Routes>
        </Router>
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
  handleLogout, // Receive handleLogout as a prop
}) => {
  return (
    <Container 
      sx={{
        background: 'linear-gradient(to right, #536976, #292e49)',
        boxShadow: '0px 0px 40px 20px rgba(0, 0, 0, 0.7)',
        marginTop: '1%',
        paddingTop: '2%',
        maxHeight: '100vh',
        borderRadius: '15%',
      }}
    >
      <Grid container 
        spacing={2} 
        sx={{ 
          height: '85vh',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {!accessToken ? (
          <Grid item>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleLogin}
                sx={{
                  marginTop: '20%',
                }}
              >
                Log in with Spotify
              </Button>
              <PlayCircleIcon 
                sx={{ 
                  fontSize: '30em',
                  marginTop: '45%', 
                  color: 'primary',
                  boxShadow: '0px 0px 40px 20px rgba(0, 0, 0, 0.7)',
                  borderRadius: '4px',
                }} 
              />
            </div>
          </Grid>
        ) : (
          <Grid container spacing={0} item xs={12}>
            <Box display="flex" justifyContent="space-between" sx={{ width: '100%', marginTop: '3%' }}>
              <Grid item xs={6} 
                sx={{ 
                  paddingLeft: '15px',
                  marginRight: '15px', 
                  maxHeight: '75vh',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  paddingBottom: '2%',
                }}
              >
                <SearchBar setSearchResults={setSearchResults} accessToken={accessToken} />
                <SearchResults searchResults={searchResults} playlist={playlist} setPlaylist={setPlaylist} />
              </Grid>
              <Grid item xs={6} 
                sx={{
                  paddingLeft: '15px',
                  marginLeft: '15px',
                  maxHeight: '75vh',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  paddingBottom: '2%',
                }}
              >
                <Playlist playlist={playlist} setPlaylist={setPlaylist} />
              </Grid>
            </Box>
          </Grid>
        )}

        {accessToken && ( // Only show logout button if accessToken exists
          <Box 
            sx={{ 
              display: 'flex',         
              justifyContent: 'center', // Center the button horizontally
              marginTop: '10px', 
              marginBottom: '10px',
            }}
          >
            <Button
              variant="outlined"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

// Callback Component to handle the Spotify redirect
const Callback = ({ setAccessToken }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');

    if (code) {
      getAccessToken(code)
        .then((data) => {
          setAccessToken(data.access_token);
          localStorage.setItem('spotifyAccessToken', data.access_token);
          navigate('/');  // Redirect back to home after successful login
        })
        .catch((error) => {
          console.error('Error during authentication', error);
        });
    }
  }, [location, navigate, setAccessToken]);

  return <h2>Loading...</h2>;
};

export default App;
