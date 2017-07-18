export default async (req, res, next) => {
    try {
        req.checkBody('roomId', 'Invalid room ID').isAlpha();
        req.checkBody('artists', 'Invalid artists').isValidArtistsArray();
        req.checkBody('images', 'Invalid images').isValidImagesArray();
        req.checkBody('name', 'Invalid name').notEmpty();
        req.checkBody('durationMs', 'Invalid duration').isInt();

        const validation = await req.getValidationResult();

        if(!validation.isEmpty()) {
            res.status(400).send({
                errors: validation.array()
            });
            return;
        }
        
        // do thangs

    } catch(ex) {
        next(ex);
    }
};