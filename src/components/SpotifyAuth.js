// SpotifyAuth.js
import axios from 'axios';

// Spotify credentials
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback';

// Step 1: Redirect user to Spotify login
export const loginWithSpotify = () => {
  const scopes = [
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-private',
  ];

  // Wrap the URL in backticks for template literals
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&show_dialog=true`;

  window.location = authUrl;
};

// Step 2: Exchange authorization code for access token
export const getAccessToken = async (code) => {
  const authOptions = {
    headers: {
      Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', body, authOptions);
    return response.data;  // Contains accessToken, refreshToken, etc.
  } catch (error) {
    console.error('Error getting access token', error);
    throw error;
  }
};

// Step 3: Refresh token (if needed)
export const refreshToken = async (refreshTokenValue) => {
  const authOptions = {
    headers: {
      Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshTokenValue,
  });

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', body, authOptions);
    return response.data.access_token; // Return the new access token
  } catch (error) {
    console.error('Error refreshing access token', error);
    throw error;
  }
};

// New Function: Create a Playlist
export const createPlaylist = async (userId, playlistName, accessToken) => {
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: playlistName,
        description: 'My playlist description', // Optional
        public: false, // Set to true if you want it public
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // Returns the created playlist data
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error; // Handle error appropriately
  }
};

// Function to get User Profile
export const getUserProfile = async (accessToken) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.id; // Return user ID
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error; // Handle error appropriately
  }
};
