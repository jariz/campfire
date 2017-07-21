import moniker from 'moniker';
import { Room } from '../../models';
import pascalcase from 'uppercamelcase';
import SpotifyWebApi from '../../services/SpotifyWebApi';
import { User } from '../../models';
import orm from '../../orm';
const { r, Errors } = orm;

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

const getPlaybackInfo = (room) => {
    if(!room.tracks.length) {
        return {
            currentTrack: null,
            isPlaying: false,
            progressMs: null
        };
    }
    
    const tracks = room.tracks.reverse();
    
    const findCurrentTrack = () => {
        for(const [index, track] of tracks.entries()) {
            const prevTrack = tracks[index - 1];

            if(!prevTrack && !track.started) {
                // no start date, no previous track. this is the current track.
                return track;
            }

            if(track.paused) {
                // if a track is paused it's the current track
                return track;
            }

            if(!track.started) {
                // current track has no start time, infer start date from previous track
                track.started = new Date(+new Date(prevTrack.started) + prevTrack.durationMs);
            }

            const startDate = new Date(track.started), endDate = new Date(+startDate + track.durationMs);
            if(startDate < Date.now() && endDate > Date.now()) {
                return track;
            }
        }
    };
    
    let track = findCurrentTrack(), isPlaying, progressMs = 0;
    if(!track) {
        // there's also the case of the queue having ended. in that case we'll just return the last track available 
        // and tell the client it's 'paused'
        track = tracks.reverse()[0];
        isPlaying = false;
    } else {
        if(track.paused) {
            isPlaying = false;
            progressMs = (+new Date(track.paused)) - +new Date(track.started);
        } else if(track.started) {
            isPlaying = true;
            progressMs = Date.now() - +new Date(track.started);
        } else {
            isPlaying = false;
            progressMs = 0;
        }
    }
    
    return {
        currentTrack: track,
        isPlaying,
        progressMs
    };
};

export const put = async (req, res, next) => {
    try {
        req.checkBody('isPlaying').isBoolean();
        req.checkBody('id').isAlphanumeric();

        const validation = await req.getValidationResult();

        if(!validation.isEmpty()) {
            return res.stats(400).send({
                errors: validation.array()
            });
        }

        const room = await Room
            .get(req.body.id)
            .getJoin({
                tracks: true
            });

        if(room.ownerId !== req.tokenData.userId) {
            return res.status(403).send({
                errors: [{
                    'msg': 'You\'re not authorized to modify this room'
                }]
            });
        }
        
        const { currentTrack: track } = getPlaybackInfo(room);
        if(!track) {
            return res.status(400).send({
                errors: [{
                    'msg': 'No tracks assigned to room, unable to change playback'
                }]
            });
        }

        if(!req.body.isPlaying) {
            track.paused = Date.now();
        } else {
            if(track.paused) {
                // fake the start time
                const progress = +new Date(track.paused) - +new Date(track.started); 
                const ms = +Date.now() - progress;
                track.started = new Date(ms);
            } else {
                track.started = Date.now();
            }
            track.paused = null;
        }
        await track.save();

        res.send(track);
    } catch(ex) {
        if(ex instanceof Errors.DocumentNotFound) {
            return res.status(404).send(null);
        } else {
            next(ex);
        }
    }
};

export const get = async (req, res, next) => {
    try {
        const room = await Room
            .get(req.params.roomName)
            .getJoin({ 
                owner: { _apply: seq => seq.pluck(['displayName', 'image', 'id']) },
                tracks: {
                    _apply: seq => seq.without(['roomId']),
                    votes: {
                        _apply: seq => seq.count(),
                        _array: false
                    }
                } 
            });

        res.send({
            ...room,
            ...getPlaybackInfo(room)
        });
    }
    catch (ex) {
        if(ex instanceof Errors.DocumentNotFound) {
            return res.status(404).send(null);
        } else {
            next(ex);
        }
    }
};