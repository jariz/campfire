import { parse } from 'auth-header';
import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
    try {
        const { scheme, token } = parse(req.get('authorization'));
        let tokenData;
        if(scheme === 'Bearer') {
            tokenData = jwt.verify(token, process.env.RAZZLE_CAMPFIRE_JWT_SECRET);
        } else {
            throw new Error('Invalid authorization scheme');
        }
        req.tokenData = tokenData;
        next();
    }
    catch(ex) {
        next(ex);
    }
}