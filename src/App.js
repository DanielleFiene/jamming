import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import { Container, Button, Grid, Typography, Box } from '@mui/material';
import { loginWithSpotify, getAccessToken } from './components/SpotifyAuth';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import theme from './styles/StyleOverrides.js';
import './styles/style.css';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  // Function to log in with Spotify
  const handleLogin = () => {
    loginWithSpotify();  // Redirects user to Spotify login
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
    <ThemeProvider theme={theme}> {/* Wrap the Router in ThemeProvider */}
      <Router>
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
              />
            }
          />
          <Route path="/callback" element={<Callback setAccessToken={setAccessToken} />} />
        </Routes>
      </Router>
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
}) => {
  return (
    <Container 
      sx={{
        background: 'linear-gradient(to right, #1d4350, #a43931)',
        boxShadow: '0 8px 24px rgba(0, 0, 255, 0.8)',
        marginTop: '2%',
        paddingTop: '2%',
        maxHeight: '90vh',
        borderRadius: '15%',
      }}
    >
      <Typography variant="h4" align="center" >
    </Typography>
      <Grid container 
        spacing={2} 
        sx={{ 
          height: '90vh',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {!accessToken ? (
          <Grid item>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{
                marginTop: '20%',
              }}
            >
              Log in with Spotify
            </Button>
            <PlayCircleIcon
              style={{ marginTop: '90%', fontSize: '20em', color: '#000000' }}
            />
          </div>
        </Grid>
        ) : (
          <Grid container spacing={0} item xs={12}>
            {/* Wrap the grid items in a Box for separate positioning */}
            <Box display="flex" justifyContent="space-between" 
            sx={{ 
              width: '100%',
              marginTop: '2%',
              }}>
              <Grid item xs={6} 
              sx={{ 
                border: '2px solid red',
                paddingTop: '1%',
                paddingLeft: '15px',
                marginRight: '15px', 
                maxHeight: '75vh',
                overflowY: 'scroll',
                }}>
                <SearchBar setSearchResults={setSearchResults} accessToken={accessToken} />
                <SearchResults searchResults={searchResults} playlist={playlist} setPlaylist={setPlaylist} />
              </Grid>
              <Grid item xs={6} 
              sx={{ 
                border: '2px solid blue', 
                paddingTop: '1%',
                paddingLeft: '15px',
                marginLeft: '15px',
                maxHeight: '75vh',
                overflowY: 'scroll',
                }}>
                
                <Playlist playlist={playlist} setPlaylist={setPlaylist} />
              </Grid>
            </Box>
          </Grid>
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
