import React, { useEffect, useState, useCallback } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const SearchBar = ({ setSearchResults, accessToken }) => {
  const [query, setQuery] = useState('');

  // Function to handle the search
  const handleSearch = useCallback(async () => {
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
          limit: 40, // Limit the number of results returned
        },
      });

      setSearchResults(response.data.tracks.items); // Update search results
    } catch (error) {
      console.error('Error searching tracks:', error);
      setSearchResults([]); // Clear results on error
    }
  }, [accessToken, query, setSearchResults]);

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submit
      handleSearch(); // Call the search function directly
    }
  };

  // useEffect to watch for changes in the query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        handleSearch(); // Live search function
      } else {
        setSearchResults([]); // Clear results when input is empty
      }
    }, 300); // Delay in milliseconds for live search

    return () => clearTimeout(delayDebounceFn); // Cleanup when there is no input
  }, [query, handleSearch, setSearchResults]); // Added handleSearch to the dependency array

  return (
    <Grid container justifyContent="center" alignItems="center" direction="column">
      <Grid item>
        <TextField
          label="Search Spotify"
          variant="filled"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Live search
          onKeyDown={handleKeyDown} // Handle Enter key
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
                <SearchIcon />
              </InputAdornment>
            ),
            autoComplete: 'off',
          }}
        />
      </Grid>
      <Grid item>
        <Button 
          variant="outlined" 
          onClick={handleSearch}
          sx={{ 
            width: '100%',
            maxWidth: '400px',
            padding: { xs: '8px', sm: '16px' },
          }}
        >
          Search
        </Button> {/* Search for song on button clicking */}
      </Grid>
    </Grid>
  );
};

export default SearchBar;
