import { Track, Room } from '../../models/index';

export default async (req, res, next) => {
    try {
        req.checkBody('roomId', 'Invalid room ID').notEmpty().isAlpha();
        req.checkBody('artists', 'Invalid artists').isArray().isValidArtistsArray();
        req.checkBody('images', 'Invalid images').isArray().isValidImagesArray();
        req.checkBody('name', 'Invalid name').notEmpty();
        req.checkBody('durationMs', 'Invalid duration').notEmpty().isInt();
        req.checkBody('spotifyId', 'spotifyID missing').isAlphanumeric().notEmpty();

        const validation = await req.getValidationResult();

        if(!validation.isEmpty()) {
            res.status(400).send({
                errors: validation.array()
            });
            return;
        }
        
        // this will just crash if the room doesn't exist.
        // 🙅 !!!there are probably better solutions for this!!! 🙅
        await Room.get(req.body.roomId);
        
        const track = new Track(req.body);
        await track.save();
        
        res.status(200).send('👌');
    } catch(ex) {
        next(ex);
    }
};