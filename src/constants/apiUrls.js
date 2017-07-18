const CAMPFIRE_SPOTIFY_CLIENT_ID = process.env.RAZZLE_CAMPFIRE_SPOTIFY_CLIENT_ID;
const CAMPFIRE_BASE_URL = process.env.RAZZLE_CAMPFIRE_BASE_URL;
const SPOTIFY_BASE_URL = 'https://api.spotify.com'; 
const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com';

export const authUrl = () => `${SPOTIFY_ACCOUNTS_URL}/authorize?client_id=${CAMPFIRE_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=user-read-playback-state%20user-modify-playback-state%20user-top-read`;
export const tokenUrl = () => `${SPOTIFY_ACCOUNTS_URL}/api/token`;
export const topUrl = (timeRange = 'short_term', limit = 10) => `${SPOTIFY_BASE_URL}/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`;
export const playerUrl = () => `${SPOTIFY_BASE_URL}/v1/me/player`;
export const profileUrl = () => `${SPOTIFY_BASE_URL}/v1/me`;

export const roomUrl = (room) => `${CAMPFIRE_BASE_URL}/api/room/${room}`;
export const createRoomUrl = () => `${CAMPFIRE_BASE_URL}/api/room`;
export const meUrl = () => `${CAMPFIRE_BASE_URL}/api/me`;
