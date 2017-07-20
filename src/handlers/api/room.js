import moniker from 'moniker';
import { Room } from '../../models';
import pascalcase from 'uppercamelcase';
import SpotifyWebApi from '../../services/SpotifyWebApi';
import { User } from '../../models/index';

export const post = async (req, res, next) => {
    // simply creates a new room & playlist.
    // client side is responsible for queueing the first track based on user's recommendations (and controlling playback ofc)
    try {
        SpotifyWebApi.setAccessToken(req.tokenData.accessToken);
        
        const id = pascalcase(moniker.choose());
        const user = await User.get(req.tokenData.userId);
        
        const { body: { id: playlistId } } = await SpotifyWebApi.createPlaylist(user.spotifyId, 'Campfire session: ' + id, {
            public: false
        });
        
        // spotify adds the creator as a follower by default.
        // unfollow the playlist so it won't show up in the user's playlists.
        // fun fact: this is basically what spotify calls 'deleting' in it's client. playlists can't be deleted.
        await SpotifyWebApi.unfollowPlaylist(user.spotifyId, playlistId);
        
        const room = new Room({
            id,
            ownerId: req.tokenData.userId,
            playlistId: playlistId
        });

        const roomDoc = await room.saveAll({ owner: true });
        res.send(roomDoc);
    }
    catch (ex) {
        next(ex);
    }
};

export const put = async (req, res, next) => {
    req.checkParams('roomName', 'Invalid room ID').notEmpty().isAlpha();
    
    req.checkBody('isPlaying').isBoolean();
    req.checkBody('id').isAlphanumeric();
    req.checkBody('offset').isInt();
    
    const room = await Room.get(req.params.roomName);
    
    if(room.ownerId !== req.tokenData.userId) {
        return res.status(403).send({
            errors: [{
                'msg': 'You\'re not authorized to modify this room'
            }]
        });
    }
    
    // todo
};

export const get = async (req, res, next) => {
    try {
        const room = await Room
            .get(req.params.roomName)
            .getJoin({ 
                owner: { _apply: sequence => sequence.pluck(['displayName', 'image', 'id']) },
                tracks: {
                    _apply: seq => seq.pluck(['id']),
                    votes: {
                        _apply: seq => seq.count(),
                        _array: false
                    }
                }
            });

        res.send(room);
    }
    catch (ex) {
        next(ex);
    }
};