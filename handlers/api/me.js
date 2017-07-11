import { User } from '../../models';

export default async (req, res, next) => {
    try {
        const { userId } = req.tokenData;
        const { displayName, id, image, spotifyId } = await User.get(userId);

        res.send({
            displayName,
            id,
            image,
            spotifyId
        });
    } catch(ex) {
        next(ex);
    }
};