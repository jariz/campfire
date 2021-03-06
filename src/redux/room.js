// @flow

import throwIfNotOK from '../services/throwIfNotOK';
import { createRoomUrl, queueUrl, roomUrl, topUrl } from '../constants/apiUrls';
import { setError } from './error';
import decode from 'jwt-decode';
import chance from 'chance';
import type { IProfile } from './user';

// state def
export type ITrack = {
    id: string,
    roomId: string,
    spotifyId: string,
    votes: number
}

export type RoomState = {
    id: string,
    owner: ?IProfile,
    tracks: ITrack[],
    loaded: false
};

const defaultState: RoomState = {
    id: '',
    owner: null,
    tracks: [],
    loaded: false
};

export type Action = SetRoomAction;

// actions
type SetRoomAction = {
    type: 'SET_ROOM',
    payload: RoomState
};

// reducer
export default (state: RoomState = defaultState, action: Action) => {
    switch (action.type) {
        case 'SET_ROOM':
            return {
                ...state,
                ...action.payload,
                loaded: true
            };
        default:
            return state;
    }
};

// action creators
export const setRoom = (room: RoomState): SetRoomAction => ({
    type: 'SET_ROOM',
    payload: room
});

export const createRoom = (token: string) => async (dispatch: Function) => {
    try {
        const resp = await fetch(createRoomUrl(), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        throwIfNotOK(resp);
        return await resp.json();
    }
    catch(ex) {
        dispatch(setError(ex));
        throw ex;
    }
};

export const getRoom = (token: string, room: string) => async (dispatch: Function) => {
    try {
        const resp = await fetch(roomUrl(room), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        throwIfNotOK(resp);
        const body = await resp.json();
        dispatch(setRoom(body));
        return body;
    }
    catch(ex) {
        dispatch(setError(ex));
        throw ex;
    }
};

export const queueTrack = (token: string, track: ITrack) => async (dispatch: Function) => {
    const resp = await fetch(queueUrl(), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify(track)
    });
    throwIfNotOK(resp);
    // gr8 success
};

/**
 * Looks for user's top tracks and queues one at random
 */
export const queueRecommendedTrack = (token: string, roomId: string) => async (dispatch: Function) => {
    try {
        const { accessToken } = decode(token);
        const resp = await fetch(topUrl(), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        throwIfNotOK(resp);
        
        const body = await resp.json();
        const number = chance().integer({min: 0, max: body.items.length});
        const track = body.items[number];
        await dispatch(queueTrack(token, {
            spotifyId: track.id,
            roomId
        }));
        return body;
    }
    catch(ex) {
        dispatch(setError(ex));
        throw ex;
    }
};

