import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSpotify } from './SpotifyContext'; // Assuming you're using the context created earlier
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const OtherPlaylists = ({ isOpen, onClose }) => {
  const { accessToken } = useSpotify();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (accessToken) {
        try {
          const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setPlaylists(response.data.items);
        } catch (error) {
          console.error('Error fetching playlists:', error);
        }
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Your Playlists</DialogTitle>
      <DialogContent>
        <List>
          {playlists.map(playlist => (
            <ListItem button component="a" href={playlist.external_urls.spotify} target="_blank" key={playlist.id}>
              <ListItemText primary={playlist.name} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtherPlaylists;
