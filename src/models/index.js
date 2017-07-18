import thinky from '../orm';
import { type } from 'thinky';

export const Track = thinky.createModel('Tracks', {
    roomId: type.string(),
    artists: [{
        id: type.string(),
        name: type.string()
    }],
    images: [{
        height: type.number(),
        width: type.number(),
        url: type.string()
    }],
    spotifyId: type.string(),
    name: type.string(),
    durationMs: type.number()
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
    activeTrackId: type.string(),
    ownerId: type.string()
});

Room.belongsTo(User, 'owner', 'ownerId', 'id');
Room.hasMany(Track, 'queue', 'id', 'roomId');
Room.hasOne(Track, 'activeTrack', 'activeTrackId', 'id');
Track.belongsTo(Room, 'activeTrack', 'activeTrackId', 'id');