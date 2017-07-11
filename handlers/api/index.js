import { Router } from 'express';
import me from './me';
import refresh from './refresh';
import { parse } from 'auth-header';
import jwt from 'jsonwebtoken';
import { post as postRoom, get as getRoom} from './room';

const router = Router();

router.get('/room/:roomName', getRoom);

// all calls are authenticated
router.use('/', async (req, res, next) => {
    try {
        const { scheme, token } = parse(req.get('authorization'));
        let tokenData;
        if(scheme === 'Bearer') {
            tokenData = jwt.verify(token, process.env.CAMPFIRE_JWT_SECRET);
        } else {
            throw new Error('Invalid authorization scheme');
        }
        req.tokenData = tokenData;
        next();
    }
    catch(ex) {
        next(ex);
    }
});

router.get('/me', me);
router.get('/refresh', refresh);
router.post('/room', postRoom);

export default router;