import { Track, Room, Vote } from '../../models/index';
import SpotifyWebApi from '../../services/SpotifyWebApi';

export default async (req, res, next) => {
    try {
        req.checkBody('roomId', 'Invalid room ID').notEmpty().isAlpha();
        req.checkBody('spotifyId', 'spotifyID missing').isAlphanumeric().notEmpty();

        const validation = await req.getValidationResult();

        if(!validation.isEmpty()) {
            res.status(400).send({
                errors: validation.array()
            });
            return;
        }
        
        const { roomId, spotifyId } = req.body;
        const { userId } = req.tokenData;
        
        // this will just crash if the room doesn't exist.
        // 🙅 !!!there are probably better solutions for this!!! 🙅
        const { owner, playlistId } = await Room.get(roomId).getJoin({ owner: true });
        
        const trackData = await SpotifyWebApi.getTrack(spotifyId);
        const track = new Track({
            spotifyId,
            durationMs: trackData.body.duration_ms,
            roomId
        });
        await track.save();
        
        const vote = new Vote({
            trackId: track.id,
            userId,
        });
        await vote.save();

        // pretend we're the owner 😈
        SpotifyWebApi.setAccessToken(owner.accessToken);
        await SpotifyWebApi.addTracksToPlaylist(owner.spotifyId, playlistId, [`spotify:track:${spotifyId}`]);
        
        res.status(200).send('👌');
    } catch(ex) {
        next(ex);
    }
};