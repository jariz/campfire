import thinky from '../orm';
import { type } from 'thinky';

export const Track = thinky.createModel('Tracks', {
    roomId: type.string(),
    spotifyId: type.string(),
    started: type.date(),
    paused: type.date(),
    durationMs: type.number()
});

export const Vote = thinky.createModel('Votes', {
    trackId: type.string(),
    userId: type.string()
});

export const User = thinky.createModel('Users', {
    displayName: type.string(),
    spotifyId: type.string(),
    image: type.string(),
    accessToken: type.string(),
    accessTokenExpireDate: type.date(),
    refreshToken: type.string(),
});

export const Room = thinky.createModel('Rooms', {
    id: type.string(),
    playlistId: type.string(),
    ownerId: type.string()
});

Room.belongsTo(User, 'owner', 'ownerId', 'id');
Room.hasMany(Track, 'tracks', 'id', 'roomId');
Track.hasMany(Vote, 'votes', 'id', 'trackId');