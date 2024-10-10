import React, { useState } from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Grid } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const Tracklist = ({ tracks, onRemove, onTrackClick }) => {
  const [playingTrack, setPlayingTrack] = useState(null); // Track currently being played

  const handlePlayPause = (track) => {
    if (playingTrack && playingTrack.id === track.id) {
      // If the clicked track is already playing, stop it
      setPlayingTrack(null);
    } else {
      // Set the clicked track as the currently playing track
      setPlayingTrack(track);
      onTrackClick(track); // Call the function to play the track
    }
  };

  return (
    <>
      {tracks.map((track, index) => {
        const albumImage = track.album.images[0]?.url; // Get the album image for each track
        
        return (
          <ListItem 
            key={track.id} 
            button 
            onClick={() => handlePlayPause(track)} // Call play/pause on click
            sx={{
              transition: 'background-color 0.3s, transform 0.3s', // Smooth transition for hover
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Change this color to your preferred hover color
                transform: 'scale(1.02)', // Scale effect for hover
              },
            }}
          >
            <ListItemAvatar>
              {albumImage && (
                <Avatar src={albumImage} alt={track.album.name} /> // Display album image as avatar
              )}
            </ListItemAvatar>
            <ListItemText
              primary={track.name} // Display the track name
              secondary={
                <>
                  <div>Artist: {track.artists.map(artist => artist.name).join(', ')}</div>
                  <div>Album: {track.album.name}</div> {/* Album name */}
                </>
              }
              primaryTypographyProps={{
                style: { fontWeight: 600 }, // Bold font for the song title
              }}
            />
            <Grid container justifyContent="flex-end" alignItems="center">
              <IconButton 
                color="secondary" 
                onClick={(e) => { e.stopPropagation(); onRemove(track); }} // Prevent ListItem click when removing
                aria-label="remove track"
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
              <IconButton 
                color="primary" 
                onClick={(e) => { 
                  e.stopPropagation(); // Prevent ListItem click when playing
                  handlePlayPause(track); 
                }} 
                aria-label={playingTrack && playingTrack.id === track.id ? "pause track" : "play track"}
              >
                {playingTrack && playingTrack.id === track.id ? <PauseIcon /> : <PlayArrowIcon />} {/* Play/Pause icon */}
              </IconButton>
            </Grid>
          </ListItem>
        );
      })}
    </>
  );
};

export default Tracklist;
