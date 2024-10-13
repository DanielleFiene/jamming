import React, { useState } from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Grid, Typography, Tooltip } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'; // Solid remove icon
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const Tracklist = ({ tracks, onRemove, onTrackClick }) => {
  const [playingTrack, setPlayingTrack] = useState(null); // Track currently being played

  const handlePlayPause = (track) => {
    if (playingTrack && playingTrack.id === track.id) {
      setPlayingTrack(null); // Stop the current track
    } else {
      setPlayingTrack(track); // Set the clicked track as currently playing
      onTrackClick(track); // Call the function to play the track
    }
  };

  return (
    <>
      {tracks.map((track) => {
        const albumImage = track.album.images[0]?.url; // Get the album image for each track
        const isPlaying = playingTrack && playingTrack.id === track.id; // Determine if this track is currently playing

        return (
          <ListItem 
            key={track.id} 
            button 
            onClick={() => handlePlayPause(track)} // Call play/pause on click
            sx={{
              backgroundColor: isPlaying ? 'rgba(0, 150, 0, 0.2)' : 'transparent', // Highlight if playing
              borderLeft: isPlaying ? '4px solid #00ff00' : 'none', // Add a green border for the current track
              transition: 'background-color 0.3s, transform 0.3s',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.02)',
              },
              padding: { xs: '8px', sm: '16px' },
              margin: 0, // Remove any default margin
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // Optional: Add a bottom border for separation
            }}
          >
            <ListItemAvatar>
              {albumImage && (
                <Avatar 
                  src={albumImage} 
                  alt={track.album.name} 
                  sx={{ width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 }, marginLeft: { xs: '-10px' } }} // Responsive avatar size
                />
              )}
            </ListItemAvatar>
            <Grid container spacing={1} sx={{ flexDirection: { xs: 'column', sm: 'row' } }} alignItems="flex-start">
              <Grid item xs>
                <ListItemText
                  primary={
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600, 
                        fontSize: { xs: '0.9em', sm: '1em' },
                      }}
                    >
                      {track.name}
                    </Typography>
                  } // Display the track name
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75em', sm: '0.85em' } }}>
                        {track.artists.map(artist => artist.name).join(', ')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75em', sm: '0.85em' } }}>
                        {track.album.name}
                      </Typography>
                    </>
                  }
                />
              </Grid>
              <Grid item>
                <Grid container direction="row" spacing={1} alignItems="center">
                  <Grid item>
                    <Tooltip title="Remove track">
                      <IconButton 
                        color="secondary" 
                        onClick={(e) => { e.stopPropagation(); onRemove(track); }} // Prevent ListItem click when removing
                        aria-label="remove track"
                        sx={{ padding: { xs: '5px', sm: '8px' } }} 
                      >
                        <RemoveCircleIcon /> {/* Solid remove icon */}
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title={isPlaying ? "Pause track" : "Play track"}>
                      <IconButton 
                        color="primary" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handlePlayPause(track); 
                        }} 
                        aria-label={isPlaying ? "pause track" : "play track"}
                        sx={{ padding: { xs: '5px', sm: '8px' } }}
                      >
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />} {/* Icon changes based on isPlaying */}
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ListItem>
        );
      })}
    </>
  );
};

export default Tracklist;
