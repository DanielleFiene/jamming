import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, ListItemAvatar, Avatar, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const Track = ({ track, onAdd, onPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    onPlay(track);
  };

  const albumImage = track.album.images[0]?.url;

  return (
    <ListItem 
      sx={{
        transition: 'background-color 0.3s, transform 0.3s',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          transform: 'scale(1.02)',
        },
        padding: { xs: '8px', sm: '16px' }, // Consistent padding
        margin: 0, // Remove any default margin
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // Optional: Add a bottom border for separation
      }}
    >
      <ListItemAvatar>
        {albumImage && (
          <Avatar 
            src={albumImage} 
            alt={track.album.name} 
            sx={{ width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 }, marginLeft: {xs: '-10px'} }} 
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
            }
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
              <IconButton 
                color="primary" 
                onClick={(e) => { e.stopPropagation(); onAdd(track); }} 
                aria-label="add track"
                sx={{ padding: { xs: '5px', sm: '8px' } }} // Responsive padding for buttons
              >
                <AddIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton 
                color="primary" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handlePlayPause(); 
                }} 
                aria-label={isPlaying ? "pause track" : "play track"}
                sx={{ padding: { xs: '5px', sm: '8px' } }} // Responsive padding for buttons
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default Track;
