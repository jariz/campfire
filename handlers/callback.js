import { User } from '../models';
import { profileUrl, tokenUrl } from '../constants/apiUrls';
import throwIfNotOK from '../services/throwIfNotOK';
import { stringify as toQuery } from 'querystring';
import jwt from 'jsonwebtoken';

export default async (app, req, res, next) => {
    try {
        req.checkQuery('code', 'Invalid code').notEmpty();
        
        const validation = await req.getValidationResult();
        
        if(!validation.isEmpty()) {
            res.status(400).send({
                errors: validation.array()
            });
            return;
        }
        
        const { code } = req.query;
        
        let request = await fetch(tokenUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: toQuery({
                grant_type: 'authorization_code',
                code,
                redirect_uri: 'http://localhost:3000/callback', // todo
                client_id: process.env.CAMPFIRE_SPOTIFY_CLIENT_ID,
                client_secret: process.env.CAMPFIRE_SPOTIFY_CLIENT_SECRET
            })
        });
        throwIfNotOK(request);
        const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = await request.json();
        
        request = await fetch(profileUrl(), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        throwIfNotOK(request);
        const out = await request.json();
        const { display_name: displayName, images, id } = out;
        let image = null;
        
        if(images.length) {
            image = images[0].url;
        }
        
        // todo check for user with existing spotify id
        
        const user = new User({
            accessToken,
            refreshToken,
            accessTokenExpireDate: new Date(+new Date() + (expiresIn * 1000)),
            displayName,
            spotifyId: id,
            image
        });
        
        const doc = await user.save();
        
        app.render(req, res, '/callback', {
            token: jwt.sign({
                accessToken,
                userId: doc.id
            }, process.env.CAMPFIRE_JWT_SECRET)
        });
        
    } catch(ex) {
        next(ex);
    }
};