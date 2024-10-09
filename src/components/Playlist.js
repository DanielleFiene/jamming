import React, { useEffect, useState } from 'react';
import Tracklist from './Tracklist';
import { Button, List, Box, Typography } from '@mui/material';

const Playlist = ({ playlist, setPlaylist, accessToken }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);

  // Initialize Spotify Player
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
    if (window.Spotify) {
      initPlayer();
    } else {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      script.onload = initPlayer;
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

  const togglePlayPause = async () => {
    if (player) {
      if (isPlaying) {
        await player.pause();
      } else {
        await player.resume();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      sx={{ textAlign: 'center' }} 
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: '600' }}>
        Your Playlist
      </Typography>
      <List>
        <Tracklist tracks={playlist} onRemove={(track) => setPlaylist(playlist.filter(t => t.id !== track.id))} />
      </List>
      
      {/* Playback Controls */}
      <Box sx={{ marginTop: '15px' }}>
        <Button variant="outlined" color="primary" onClick={previousTrack} disabled={currentTrackIndex === 0}>
          Previous
        </Button>
        <Button 
          variant="contained" 
          color={isPlaying ? 'secondary' : 'primary'} 
          onClick={togglePlayPause}
          sx={{ marginX: '10px' }} 
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="outlined" color="primary" onClick={nextTrack} disabled={currentTrackIndex === null || currentTrackIndex >= playlist.length - 1}>
          Next
        </Button>
      </Box>
      
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => setPlaylist([])} 
        sx={{ marginTop: '15px', marginBottom: '15px' }} 
      >
        Clear Playlist
      </Button>
    </Box>
  );
};

export default Playlist;
