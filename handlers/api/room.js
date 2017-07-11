import moniker from 'moniker';
import { Room } from '../../models';
import pascalcase from 'uppercamelcase';

export const post = async (req, res, next) => {
    // simply creates a new room.
    // client side is responsible for queueing the first track based on user's recommendations (and controlling playback)
    try {
        const room = new Room({
            id: pascalcase(moniker.choose()),
            ownerId: req.tokenData.userId
        });
        
        const roomDoc = await room.saveAll({owner: true});
        res.send(roomDoc);
    }
    catch(ex) {
        next(ex);
    }
};

export const get = async(req, res, next) => {
    try {
        const room = await Room
            .get(req.params.roomName)
            .getJoin({ owner: true });
        
        res.send(room);
    }
    catch(ex) {
        next(ex);
    }
};