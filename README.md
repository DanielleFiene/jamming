# Jamming/Jamspace

JamSpace is a responsive web application that allows users to search for songs, play them, create custom playlists, and save them directly to their Spotify accounts. Users can also access their existing playlists and play tracks from them, providing a seamless music experience.

**Note**: Due to Spotify's API permission requirements, users must request special access to play songs and retrieve playlists. Currently, only the application owner has whitelisted access.

## Features

- **Search for Songs**: Users can easily search for their favorite tracks using the Spotify API.
- **Play Songs**: Play any song directly from the search results or from saved playlists (requires special permissions).
- **Create Playlists**: Users can add tracks to a new playlist and customize the playlist name.
- **Save to Spotify**: Save the newly created playlists to your Spotify account.
- **Access Existing Playlists**: Retrieve and play existing playlists from the user's Spotify account (requires special permissions).
- **Responsive Design**: The application is designed to work seamlessly across various devices, providing a great user experience on both desktop and mobile.

## Technologies Used

- **React**: For building the user interface.
- **Material-UI**: For styling and responsive design components.
- **Spotify API**: To fetch song data and manage user playlists.
- **Axios**: For making HTTP requests to the Spotify API.

## Live Demo

You can try out JamSpace live at [https://jamspace-tan.vercel.app/](https://jamspace-tan.vercel.app/).
Live demo on Youtube:
https://youtu.be/cgD3E7yh4Lw

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/jamspace.git
   cd jamspace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a Spotify Developer Account**:
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).
   - Create a new application to get your `clientId` and `clientSecret`.

4. **Set up Environment Variables**:
   Create a `.env` file in the root of the project and add your Spotify credentials:
   ```bash
   REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
   REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret
   REACT_APP_REDIRECT_URI=https://your_redirect_uri
   ```

5. **Start the Application**:
   ```bash
   npm start
   ```

6. **Open the application** in your web browser:
   Navigate to `http://localhost:3000`.

## Usage

- After starting the application, log in using your Spotify account to allow the app to access your playlists and manage them.
- Use the search feature to find and play songs (note: special permissions are required to play songs).
- Create new playlists by adding tracks from the search results.
- Rename your playlists and save them directly to your Spotify account.
- Access your existing playlists and play tracks from them (note: special permissions are required).

## Permissions

- Due to Spotify's API limitations, users need special permission to play songs and retrieve playlists. Currently, only the application owner has the necessary access. 

If you would like to request access or have any questions, please reach out.

## Contributing

Contributions are welcome! If you would like to contribute to this project, please fork the repository and create a pull request. 

1. **Fork the repository**
2. **Create your feature branch**
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/YourFeature
   ```
5. **Open a pull request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Spotify API Documentation](https://developer.spotify.com/documentation/web-api/)
- [Material-UI Documentation](https://mui.com/)
- Special thanks to all contributors and the open-source community!
