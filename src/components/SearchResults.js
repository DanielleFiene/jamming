import React from 'react';
import Track from './Track';
import { List, Typography } from '@mui/material';

const SearchResults = ({ searchResults, playlist, setPlaylist, handlePlayPause, playingTrack }) => {

  // Function to add a track to the playlist
  const addTrackToPlaylist = (track) => {
    if (!playlist.some(t => t.id === track.id)) {
      setPlaylist([...playlist, track]);
    }
  };

  return (
    <List>
      {searchResults.length === 0 ? (
        <Typography variant="subtitle1" color="textSecondary">
          No results found.
        </Typography>
      ) : (
        searchResults.map(track => (
          <Track 
            key={track.id} 
            track={track} 
            onAdd={addTrackToPlaylist} 
            onPlayPause={handlePlayPause} // Pass down play/pause function
            isPlaying={playingTrack && playingTrack.id === track.id} // Check if track is currently playing
          />
        ))
      )}
    </List>
  );
};

export default SearchResults;
