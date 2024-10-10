import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Grid } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const Tracklist = ({ tracks, onRemove }) => {
  return (
    <>
      {tracks.map(track => {
        const albumImage = track.album.images[0]?.url; // Get the album image for each track
        
        return (
          <ListItem key={track.id}>
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
            <Grid container justifyContent="flex-end">
              <IconButton 
                color="secondary" 
                onClick={() => onRemove(track)} 
                aria-label="remove track"
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Grid>
          </ListItem>
        );
      })}
    </>
  );
};

export default Tracklist;
