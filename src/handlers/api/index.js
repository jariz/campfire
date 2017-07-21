import { Router } from 'express';
import me from './me';
import refresh from './refresh';
import { post as postRoom, get as getRoom, put as putRoom } from './room';
import queue from './queue';
import authMiddleware from '../../authMiddleware';

const router = Router();

router.post('/room/queue', authMiddleware, queue);
router.put('/room', authMiddleware, putRoom);
router.get('/room/:roomName', getRoom);

// all calls are authenticated from now on
router.use(authMiddleware);

router.get('/me', me);
router.get('/refresh', refresh);
router.post('/room', postRoom);

export default router;