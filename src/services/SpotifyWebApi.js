import SpotifyWebApi from 'spotify-web-api-node';

export default new SpotifyWebApi({
    clientId: process.env.RAZZLE_CAMPFIRE_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.RAZZLE_CAMPFIRE_SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.RAZZLE_CAMPFIRE_REDIRECT_URL
});