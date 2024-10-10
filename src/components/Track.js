import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, ListItemAvatar, Avatar, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const Track = ({ track, onAdd, onPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false); // State to manage play/pause status

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying); // Toggle play/pause state
    onPlay(track); // Call the onPlay function passed from the parent
  };

  // Extracting the album image from the track object 
  const albumImage = track.album.images[0]?.url; // Get the first image URL from Spotify

  return (
    <ListItem 
      sx={{
        transition: 'background-color 0.3s, transform 0.3s', // Smooth transition for hover
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // Change this to your preferred hover color
          transform: 'scale(1.02)', // Scale effect for hover
        },
      }}
      // Remove the onClick from ListItem to prevent playing on item click
    >
      <ListItemAvatar>
        {albumImage && (
          <Avatar src={albumImage} alt={track.album.name} /> // Using avatar to display the album
        )}
      </ListItemAvatar>
      <ListItemText
        primary={track.name} // Track name title of the song
        secondary={
          <>
            <div>Artist: {track.artists.map(artist => artist.name).join(', ')}</div>
            <div>Album: {track.album.name}</div> {/* Album name */}
          </>
        }
        primaryTypographyProps={{
          style: { fontWeight: 600 }, // Target song title font weight finally found it!
        }}
      />
      <Grid container justifyContent="flex-end" alignItems="center">
        <IconButton 
          color="primary" 
          onClick={(e) => { e.stopPropagation(); onAdd(track); }} // Prevents ListItem click event when adding
          aria-label="add track"
        >
          <AddIcon />
        </IconButton>
        <IconButton 
          color="primary" 
          onClick={(e) => { 
            e.stopPropagation(); // Prevents ListItem click event when playing
            handlePlayPause(); 
          }} // Call the function to play/pause
          aria-label={isPlaying ? "pause track" : "play track"}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />} {/* Show the corresponding icon */}
        </IconButton>
      </Grid>
    </ListItem>
  );
};

export default Track;
