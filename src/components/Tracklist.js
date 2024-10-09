import React from 'react';
import { ListItem, IconButton, Grid } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'; // Import the remove icon

const Tracklist = ({ tracks, onRemove }) => {
  return (
    <>
      {tracks.map(track => (
        <ListItem key={track.id}>
          <div>
            <strong>{track.name}</strong> by {track.artists[0].name}
          </div>
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
      ))}
    </>
  );
};

export default Tracklist;
