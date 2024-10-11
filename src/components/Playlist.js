import React, { useEffect, useState } from 'react';
import Tracklist from './Tracklist'; 
import { Button, List, Box, Typography, TextField, Tooltip, Snackbar } from '@mui/material'; // Added Snackbar import
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { createPlaylist, getUserProfile } from './SpotifyAuth'; // Import your functions
import axios from 'axios'; // Ensure axios is imported for API calls

const Playlist = ({ playlist, setPlaylist, accessToken }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [playlistName, setPlaylistName] = useState('Your Playlist');
  const [isEditing, setIsEditing] = useState(false);
  
  // New state variables for Snackbar
  const [successMessage, setSuccessMessage] = useState(''); // For the success message
  const [snackbarOpen, setSnackbarOpen] = useState(false); // For Snackbar visibility

  // Function to initialize the Spotify Player
  const initPlayer = () => {
    const player = new window.Spotify.Player({
      name: 'Web Player',
      getOAuthToken: cb => { cb(accessToken); },
      volume: 0.5,
    });

    player.connect();

    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    setPlayer(player);
  };

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      initPlayer();
    };

    if (window.Spotify) {
      initPlayer();
    } else {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const playTrack = async (index) => {
    if (player && playlist[index]) {
      const trackUri = playlist[index].uri;

      if (!trackUri) {
        console.error('Track URI is not valid:', trackUri);
        return;
      }

      try {
        await player._send("player/play", { uris: [trackUri] });
        setCurrentTrackIndex(index);
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing track:', error);
      }
    } else {
      console.error('Player not initialized or no track found at index:', index);
    }
  };

  const playAllTracks = async () => {
    if (player && playlist.length > 0) {
      await playTrack(0);
      player.addListener('ended', () => {
        if (currentTrackIndex < playlist.length - 1) {
          playTrack(currentTrackIndex + 1);
        } else {
          setIsPlaying(false);
        }
      });
    }
  };

  const shuffleAndPlay = () => {
    const shuffledPlaylist = [...playlist].sort(() => Math.random() - 0.5);
    setPlaylist(shuffledPlaylist);
    playTrack(0);
  };

  const nextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      playTrack(currentTrackIndex + 1);
    }
  };

  const previousTrack = () => {
    if (currentTrackIndex > 0) {
      playTrack(currentTrackIndex - 1);
    }
  };

  const handleTrackClick = (index) => {
    playTrack(index);
  };

  const handleNameChange = (event) => {
    const newName = event.target.value;
    if (newName.trim() !== '') {
      setPlaylistName(newName);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const isDisabled = playlist.length <= 1;

  // Updated function to save the playlist
  const handleSavePlaylist = async () => {
    if (!accessToken) {
      console.error('No access token found.');
      return;
    }

    if (playlist.length === 0) {
      console.error("Can't save an empty playlist.");
      return;
    }

    // Extract URIs from the playlist
    const playlistTracks = playlist.map(track => track.uri).filter(uri => uri);

    if (playlistTracks.length === 0) {
      console.error('No valid tracks to save to the playlist.');
      return;
    }

    const requestBody = {
      name: playlistName,
      public: true, // or false based on your preference
      description: 'My playlist created with Spotify API',
    };

    try {
      // Get the user ID
      const userId = await getUserProfile(accessToken);

      // Create the playlist
      const createPlaylistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const playlistId = createPlaylistResponse.data.id;

      // Add tracks to the newly created playlist
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: playlistTracks },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Playlist saved successfully');
      
      // Set success message and open Snackbar
      setSuccessMessage('Playlist saved successfully!'); 
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  };

  // Function to handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      sx={{ textAlign: 'center' }} 
    >
      {isEditing ? (
        <TextField
          label="Playlist"
          variant="filled" 
          value={playlistName} 
          onChange={handleNameChange} 
          onBlur={toggleEditMode}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              toggleEditMode();
            }
          }}
          autoComplete="off"
          sx={{ marginBottom: '15px' }}
        />
      ) : (
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative',
            '&:hover::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -4,
              height: '1px',
              backgroundColor: '#ffffff',
              transition: 'background-color 0.3s',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -4,
              height: '1px', 
              backgroundColor: '#000000', 
              transition: 'background-color 0.3s', 
            },
          }}
          onClick={toggleEditMode}
        >
          {playlistName}
        </Typography>
      )}
      
      <List>
        <Tracklist 
          tracks={playlist} 
          onRemove={(track) => setPlaylist(playlist.filter(t => t.id !== track.id))} 
          onTrackClick={handleTrackClick} 
        />
      </List>
      
      {/* Playback Controls */}
      <Box sx={{ marginTop: '15px' }}>
        <Tooltip title="Play All Songs">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={playAllTracks}
            disabled={isDisabled} // Disable if playlist is empty
            sx={{ marginX: '5px' }}
          >
            <PlayArrowIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Shuffle and Play">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={shuffleAndPlay}
            disabled={isDisabled} // Disable if playlist is empty
            sx={{ marginX: '5px' }}
          >
            <ShuffleIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Play Previous Track">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={previousTrack} 
            disabled={isDisabled || currentTrackIndex === 0}
            sx={{ marginX: '5px' }}
          >
            <SkipPreviousIcon /> 
          </Button>
        </Tooltip>
        <Tooltip title="Play Next Track">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={nextTrack} 
            disabled={isDisabled || currentTrackIndex >= playlist.length - 1}
            sx={{ marginX: '5px' }}
          >
            <SkipNextIcon />
          </Button>
        </Tooltip>
      </Box>

      {/* Save Playlist Button */}
      <Box sx={{ marginTop: '20px' }}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleSavePlaylist}
          disabled={playlist.length === 0}
        >
          Save Playlist to Spotify
        </Button>
      </Box>

      {/* Conditional rendering for Clear Playlist button */}
      {playlist.length > 0 && (
        <Tooltip title="Clear Playlist">
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => setPlaylist([])} 
            sx={{ 
              marginTop: '20px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)',
              transition: 'ease-in, 0.3s',
              '&:hover': {
                scale: '1.05',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            Clear Playlist
          </Button>
        </Tooltip>
      )}

      {/* Snackbar for success message */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
        message={successMessage}
      />
    </Box>
  );
};

export default Playlist;
