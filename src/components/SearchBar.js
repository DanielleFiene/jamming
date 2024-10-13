import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Tooltip } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const SearchBar = ({ setSearchResults, accessToken }) => {
  const [query, setQuery] = useState('');

  // Function to handle the search
  const handleSearch = async () => {
    if (!accessToken || !query.trim()) { // Ensure there's a valid query
      setSearchResults([]); // Clear results if no valid query
      return;
    }

    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: query,
          type: 'track',
          limit: 40, // limit the number of results returned
        },
      });

      setSearchResults(response.data.tracks.items); // Update search results
    } catch (error) {
      console.error('Error searching tracks:', error);
      setSearchResults([]); // Clear results on error
    }
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submit
      handleSearch(); // Call the search function directly with button
    }
  };

  // useEffect to watch for changes in the query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        handleSearch(); // livesearch function
      } else {
        setSearchResults([]); // Clear results when input is empty
      }
    }, 300); // Delay in milliseconds so we can have livesearch but not too many api calls

    return () => clearTimeout(delayDebounceFn); // Cleanup when there is no input
  }, [query, accessToken, setSearchResults]);

  return (
    <Grid container justifyContent="center" alignItems="center" direction="column">
      <Grid item>
        <TextField
          label="Search Spotify"
          variant="filled"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Livesearch
          onKeyDown={handleKeyDown}  // so we can hit the enter as well instead of just button click
          sx={{
            marginBottom: 2, // Spacing below the text field
            width: '100%', // Adjust this to control the width of the TextField
            maxWidth: '400px', // Max width for the TextField
            padding: { xs: '8px', sm: '16px' },
            '& .MuiInputBase-input': {
              fontWeight: '800', // Input text
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title="Search for tracks">
                  <SearchIcon />
                </Tooltip>
              </InputAdornment>
            ),
            autoComplete: 'off',
          }}
        />
      </Grid>
      <Grid item>
        <Tooltip title="Click to search for tracks">
          <Button 
            variant="outlined" 
            onClick={handleSearch}
            sx={{ 
              width: '100%',
              maxWidth: '400px',
              padding: { xs: '8px', sm: '16px' },
              marginTop: '-10px',
            }}
          >
            Search
          </Button>
        </Tooltip> {/* search for song on button clicking */}
      </Grid>
    </Grid>
  );
};

export default SearchBar;
