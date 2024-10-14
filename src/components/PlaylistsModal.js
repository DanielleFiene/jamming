import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, IconButton, CircularProgress, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import axios from 'axios';

const PlaylistsModal = ({ open, handleClose, accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPlaying, setCurrentPlaying] = useState(null); // Track the currently playing playlist
  const [player, setPlayer] = useState(null); // Spotify player instance

  useEffect(() => {
    if (open && accessToken) {
      fetchPlaylists();
      setCurrentPlaying(null); // Reset current playing state when modal opens
    }
  }, [open, accessToken]);

  useEffect(() => {
    // Load Spotify Web Playback SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'My Spotify Player',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      // Error handling
      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });
      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });
      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error(message);
      });
      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error(message);
      });

      // Playback status updates
      spotifyPlayer.addListener('player_state_changed', (state) => {
        console.log(state);
      });

      // Ready event when the player is initialized
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        // Transfer playback to the web player
        axios.put(
          'https://api.spotify.com/v1/me/player',
          {
            device_ids: [device_id],
            play: false,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      });

      // Connect to the player
      spotifyPlayer.connect();
      setPlayer(spotifyPlayer); // Save player instance to state
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken, player]);

  const fetchPlaylists = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPlaylists(response.data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setError('Failed to load playlists. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistClick = async (playlistId) => {
    if (!player) return; // Make sure the player is initialized

    if (currentPlaying === playlistId) {
      // Pause the current playlist if it's already playing
      player.pause();
      setCurrentPlaying(null);
    } else {
      // Play the selected playlist
      const playlistUri = `spotify:playlist:${playlistId}`;
      try {
        await axios.put(
          'https://api.spotify.com/v1/me/player/play',
          {
            context_uri: playlistUri,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCurrentPlaying(playlistId); // Update the currently playing playlist
      } catch (error) {
        console.error('Error playing playlist:', error);
        setError('Failed to play the playlist. Please try again.');
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          background: 'linear-gradient(to left, #649173, #dbd5a4)',
          boxShadow: '0px 0px 40px 20px rgba(0, 0, 0, 0.7)',
          p: 4,
          borderRadius: '4px',
          maxWidth: 600,
          margin: 'auto',
          marginTop: '10%',
          overflowY: 'auto',
          maxHeight: '80vh',
          width: {
            xs: '80%',
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: 'text.tertiary', fontWeight: 700 }}>
            Your Playlists
          </Typography>
          <IconButton onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}
            <List>
              {playlists.map((playlist) => (
                <ListItem
                  key={playlist.id}
                  button
                  onClick={() => handlePlaylistClick(playlist.id)}
                  sx={{
                    padding: { xs: '8px', sm: '16px' },
                    margin: 0,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'background-color 0.3s, transform 0.3s',
                    backgroundColor: currentPlaying === playlist.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent', // Change background if playing
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={playlist.images[0]?.url || 'default-image-url.jpg'}
                    alt={playlist.name}
                    sx={{
                      width: 'auto',
                      height: {
                        xs: '60px',
                        sm: '70px',
                        md: '80px',
                        lg: '100px',
                        xl: '120px',
                      },
                      marginRight: 1, // MUI spacing unit, equivalent to 8px
                      maxWidth: '100%',
                      borderRadius: '4px',
                    }}
                  />
                  <ListItemText
                    primary={playlist.name}
                    primaryTypographyProps={{ sx: { color: 'text.tertiary', fontWeight: 600 } }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the ListItem's onClick
                      handlePlaylistClick(playlist.id); // Call the same function to toggle play/pause
                    }}
                    aria-label={currentPlaying === playlist.id ? 'Pause' : 'Play'}
                  >
                    <Tooltip title={currentPlaying === playlist.id ? 'Pause' : 'Play'}>
                      {currentPlaying === playlist.id ? <PauseIcon /> : <PlayArrowIcon />}
                    </Tooltip>
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default PlaylistsModal;
