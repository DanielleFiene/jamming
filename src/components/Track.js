import React from 'react';
import { ListItem, ListItemText, IconButton, ListItemAvatar, Avatar, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Track = ({ track, onAdd }) => {
  // Extracting the album image from the track object 
  const albumImage = track.album.images[0]?.url; // Get the first image URL from Spotify

  return (
    <ListItem>
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
      <Grid container justifyContent="flex-end">
        <IconButton 
          color="primary" 
          onClick={() => onAdd(track)} 
          aria-label="add track"
        >
          <AddIcon />
        </IconButton>
      </Grid>
    </ListItem>
  );
};

export default Track;
