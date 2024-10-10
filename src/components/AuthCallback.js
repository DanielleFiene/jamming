// AuthCallback.js
import React, { useEffect } from 'react';
import { getAccessToken } from './SpotifyAuth';

const AuthCallback = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          const tokens = await getAccessToken(code);
          console.log('Access Token:', tokens.access_token);
          // You can redirect the user to another page or store the tokens in context/local storage
        } catch (error) {
          console.error('Authentication error:', error);
        }
      } else {
        console.error('Authorization code not found in URL');
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div>
      <h1>Authenticating...</h1>
    </div>
  );
};

export default AuthCallback;
