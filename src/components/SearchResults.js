import React, { useState } from 'react';
import Track from './Track';
import { List, Typography } from '@mui/material';

const SearchResults = ({ searchResults, playlist, setPlaylist, player }) => {
  const [currentTrack, setCurrentTrack] = useState(null); // State to keep track of the currently playing track

  const addTrackToPlaylist = (track) => {
    if (!playlist.some(t => t.id === track.id)) {
      setPlaylist([...playlist, track]);
    }
  };

  const handlePlay = async (track) => {
    if (player) {
      const trackUri = track.uri; // Get the track URI
      if (trackUri) {
        try {
          await player._send('player/play', { uris: [trackUri] }); // Send play command
          setCurrentTrack(track); // Update the current track state
        } catch (error) {
          console.error('Error playing track:', error);
        }
      } else {
        console.error('Track URI is not valid:', trackUri);
      }
    } else {
      console.error('Player is not initialized.');
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
            onPlay={handlePlay} // Pass down the onPlay function to Track
          />
        ))
      )}
    </List>
  );
};

export default SearchResults;
