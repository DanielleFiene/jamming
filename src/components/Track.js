import React from 'react';
import { ListItem, ListItemText, IconButton, ListItemAvatar, Avatar, Grid, Typography, Tooltip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Solid add icon
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const Track = ({ track, onAdd, onPlayPause, isPlaying }) => {
  const albumImage = track.album.images[0]?.url;

  return (
    <ListItem
      sx={{
        transition: 'background-color 0.3s, transform 0.3s',
        backgroundColor: isPlaying ? 'rgba(255, 255, 255, 0.1)' : 'transparent', // Highlight if playing
        borderLeft: isPlaying ? '4px solid #00ff00' : 'none', // Add a green border for the current track
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // Add hover effect
          transform: 'scale(1.02)',
        },
        padding: { xs: '8px', sm: '16px' },
        margin: 0,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      onClick={() => onPlayPause(track)} // Call play/pause on click
    >
      <ListItemAvatar>
        {albumImage && (
          <Avatar
            src={albumImage}
            alt={track.album.name}
            sx={{ width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 }, marginLeft: { xs: '-10px' } }}
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
                  fontWeight: 700,
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
              <Tooltip title="Add to playlist">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the ListItem's onClick
                    onAdd(track);
                  }}
                  aria-label="add track"
                  sx={{ padding: { xs: '5px', sm: '8px' } }}
                >
                  <AddCircleIcon /> {/* Solid add icon */}
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={isPlaying ? `Pause ${track.name}` : `Play ${track.name}`}>
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayPause(track);
                  }}
                  aria-label={isPlaying ? `Pause ${track.name}` : `Play ${track.name}`}
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
};

export default React.memo(Track);
