
export default async (app, req, res, next) => {
    try {
        const { userId } = req.tokenData;
        const { displayName, id, image, spotifyId } = await User.get(userId);
        
        +new Date()
        // checks if expired, if not, passes back accessToken from db
        // if expired, do token request to spotify
    } catch(ex) {
        
    }
};