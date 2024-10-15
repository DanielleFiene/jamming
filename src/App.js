// App.js
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Header from './components/Header';
import { Container, Grid, Box, Button, Tooltip } from '@mui/material';
import { loginWithSpotify, getAccessToken } from './components/SpotifyAuth';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import { theme, GlobalScrollbarStyles } from './styles/StyleOverrides.js';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PlaylistsModal from './components/PlaylistsModal';
import './styles/style.css';

// not using refreshToken because i dont have a backend and dont want to increase risk

const App = () => {
  // State variables for managing application state
  const [searchResults, setSearchResults] = useState([]); // Results from search queries
  const [playlist, setPlaylist] = useState([]); // Current user's playlist
  const [accessToken, setAccessToken] = useState(''); // User's Spotify access token
  const [refreshToken, setRefreshToken] = useState(''); // User's Spotify refresh token
  const [playingTrack, setPlayingTrack] = useState(null); // Currently playing track
  const [isModalOpen, setIsModalOpen] = useState(false); // State for managing modal visibility
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState(null); // Device ID for Spotify SDK
  const [player, setPlayer] = useState(null); // Spotify Web Player
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to log in with Spotify
  const handleLogin = () => {
    loginWithSpotify(); // Redirects user to Spotify login
  };

  // Function to log out
  const handleLogout = () => {
    setAccessToken(''); // Clear the access token
    localStorage.removeItem('spotifyAccessToken');//Remove token from local storage
    localStorage.removeItem('spotifyRefreshToken');//remove refresh token from local storage
    setSearchResults([]); // Clear search results
    setPlaylist([]); // Clear the playlist
    setPlayingTrack(null); // Reset currently playing track
    navigate('/');//redirect to home again
  };

  // Function to refresh access token using refresh token
  const refreshAccessToken = async () => {
    try {
      const newAccessToken = await refreshToken(refreshToken); // Attempt to refresh the access token 
      setAccessToken(newAccessToken);  // Update state with new access token
      localStorage.setItem('spotifyAccessToken', newAccessToken); // Save new token in local storage
    } catch (error) {
      console.error('Error refreshing access token:', error); //log the error
      handleLogout(); //if the refreshing token fails then log out again
    }
  };

  // Function to save the playlist to Spotify
  const saveToSpotify = async (playlistName, trackUris) => {
    if (!accessToken) { //the check to see if a user is logged in
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
      const userId = userIdResponse.data.id; //actually extracting the id of the user

      // Create playlist
      const createPlaylistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName, //name of the Playlist
          public: false, //this makes the playlist private
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, //sending a token in the header
          },
        }
      );

      // Add tracks to the newly created playlist
      await axios.post(
        `https://api.spotify.com/v1/playlists/${createPlaylistResponse.data.id}/tracks`,
        {
          uris: trackUris, //the URI's of the tracks to add, spotify docs on URI
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, //send token in the header again
          },
        }
      );

      alert('Playlist saved to Spotify successfully!'); //confirm if the playlist is saved succesfully
    } catch (error) {
      console.error('Error saving playlist to Spotify:', error); // log the error of not
      if (error.response && error.response.status === 401) {
        // If the token expired, refresh it
        await refreshAccessToken(); //try refreshing the token
        saveToSpotify(playlistName, trackUris); // Retry saving
      } else {
        alert('Failed to save the playlist to Spotify.'); //different error message as above because of different error
      }
    }
  };

  // Function to handle saving playlist when user clicks the button
  const handleSavePlaylist = () => {
    if (playlist.length === 0) { //the check to see if the playlist is empty like equal to zero
      alert('Add some tracks to your playlist first!'); //alert the user
      return;
    }

    const trackUris = playlist.map((track) => track.uri); //extract the URI's from the playlist
    saveToSpotify('My Custom Playlist', trackUris); //call the save function
  };

  // Function to retrieve token from localStorage and refresh if needed
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('spotifyAccessToken');
    const storedRefreshToken = localStorage.getItem('spotifyRefreshToken');

    if (storedAccessToken) { //if there is a stored access token
      setAccessToken(storedAccessToken); //then set the access token in state
    }

    if (storedRefreshToken) { //if there is a refresh access token
      setRefreshToken(storedRefreshToken); //then set the refresh token in state
    }
  }, []);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    if (accessToken) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK',
          getOAuthToken: (cb) => { cb(accessToken); },
          volume: 0.5
        });

        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        player.addListener('player_state_changed', (state) => {
          if (!state) {
            return;
          }

          setPlayingTrack(state.track_window.current_track);
          setIsPlaying(!state.paused);
        });

        player.connect();
        setPlayer(player);
      };
    }
  }, [accessToken]);

  // Handle Play/Pause for a specific track
const handlePlayPause = async (track) => {
  try {
    if (playingTrack && playingTrack.id === track.id) {
      // If the same track is clicked, toggle play/pause
      if (isPlaying) {
        await player.pause(); // Pause the player
        setIsPlaying(false); // Update state to reflect paused status
      } else {
        await player.resume(); // Resume playback
        setIsPlaying(true); // Update state to reflect playing status
      }
    } else {
      if (!deviceId) {
        console.error("Device ID is not available");
        return; // Exit if no device ID
      }

      // Play the new track
      const response = await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          uris: [track.uri],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 204) {
        // Successfully started playback
        setPlayingTrack(track); // Update state to the new playing track
        setIsPlaying(true); // Update state to reflect playing status
      } else {
        console.error("Failed to start playback:", response.status);
      }
    }
  } catch (error) {
    console.error("Error handling play/pause:", error);
  }
};


// Function to handle playing a playlist
const handlePlayPlaylist = async (playlistId) => {
  if (!accessToken) {
    alert('You need to log in to play a playlist.');
    return;
  }

  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/me/player/play`, // Use the correct endpoint for playback
      {
        context_uri: `spotify:playlist:${playlistId}`, // Specify the context_uri for the playlist
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Playing playlist:', response.data);
  } catch (error) {
    console.error('Error playing playlist:', error);
    if (error.response && error.response.status === 401) {
      // If the token expired, refresh it
      await refreshAccessToken();
      handlePlayPlaylist(playlistId); // Retry playing the playlist
    } else {
      alert('Failed to play the playlist.');
    }
  }
};


  // Function to open modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <GlobalScrollbarStyles />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to right, #bbd2c5, #536976, #292e49)',
        }}
      >
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                accessToken={accessToken} // Passes the access token for authentication, allowing the child component to make API requests that require authorization.
                handleLogin={handleLogin} // Passes the function to handle user login, enabling the child component to trigger the login process.
                searchResults={searchResults} // Passes the current search results (e.g., songs, artists, etc.) to the child component for display or further processing.
                setSearchResults={setSearchResults} // Passes the function to update the search results, allowing the child component to modify the state of search results.
                playlist={playlist} // Passes the current playlist data (array of tracks) to the child component for display or manipulation.
                setPlaylist={setPlaylist} // Passes the function to update the playlist state, enabling the child component to modify the playlist.
                handleSavePlaylist={handleSavePlaylist} // Passes the save playlist function, allowing the child component to trigger the saving process for the current playlist.
                handleLogout={handleLogout} // Pass down the logout function to allow the child component to log the user out.
                handlePlayPause={handlePlayPause} // Pass down the function to toggle play/pause of the currently playing track.
                playingTrack={playingTrack} // Pass down the current track that is currently playing, allowing the child component to display or control it.
                openModal={openModal} // Pass down the function to open a modal dialog, enabling the child component to trigger modal display for additional information or actions.
              />
            }
          />
          <Route
            path="/callback"
            // AuthCallback component handles the authentication callback from Spotify
            element={<AuthCallback setAccessToken={setAccessToken} setRefreshToken={setRefreshToken} />}
          />
        </Routes>
        {/* Include the PlaylistsModal to let users see their own spotify playlists */}
        <PlaylistsModal
          open={isModalOpen} // controls visibility of the modal/opens
          handleClose={closeModal} //function to close the modal when the user is done
          accessToken={accessToken} // pass the access token to allow the API calling related to playlists
          handlePlayPlaylist={handlePlayPlaylist} // Pass the function as a prop to handle playing
        />
      </Box>
    </ThemeProvider>
  );
};

const Home = ({
  accessToken, // Access token for making API requests to Spotify
  handleLogin, // Function to trigger user login with Spotify
  searchResults, // Current search results from the search bar
  setSearchResults, // Function to update the search results state
  playlist, // Current playlist created by the user
  setPlaylist, // Function to update the playlist state
  handleSavePlaylist, // Function to save the current playlist to Spotify
  handleLogout, // Function to log the user out
  handlePlayPause, // Accept play/pause function here
  playingTrack, // Accept currently playing track here
  openModal, // Accept openModal function here
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
            md: '70vh',
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
            lg: '-40px',
            xl: '-60px',
          },
          justifyContent: {
            xs: 'center',
            sm: 'center',
          },
          alignItems: 'flex-start',
        }}
      >
        {!accessToken ? (
          <Grid item xs={12} sm={6}>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: '20%' }}>
            <Tooltip title='Click here to log in to your Spotify account'> 
                <Button variant="outlined" onClick={handleLogin}>
                  Log in with Spotify
                </Button>
              </Tooltip>
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
                <SearchResults
                  searchResults={searchResults}
                  playlist={playlist}
                  setPlaylist={setPlaylist}
                  handlePlayPause={handlePlayPause}
                  playingTrack={playingTrack}
                />
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
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '10px',
              marginBottom: '10px',
            }}
          ><Tooltip title="Click here to log out">
              <Button variant="outlined" onClick={handleLogout} sx={{ padding: { xs: '8px', sm: '16px' } }}>
                Logout
              </Button>
            </Tooltip>
            <Tooltip title="Click here to see your Spotify playlists">
              <Button variant="outlined" onClick={openModal} sx={{ padding: { xs: '8px', sm: '16px' }, marginLeft: '10px' }}>
                View My Playlists
              </Button>
            </Tooltip>
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
