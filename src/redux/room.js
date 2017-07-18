// @flow

import throwIfNotOK from '../services/throwIfNotOK';
import { createRoomUrl, roomUrl, topUrl } from '../constants/apiUrls';
import { setError } from './error';
import decode from 'jwt-decode';
import chance from 'chance';

// state def
export type IArtist = {
    id: string,
    name: string
};

export type IImage = {
    width: number,
    height: number,
    url: string
};

export type ITrack = {
    artists: IArtist[],
    images: IImage[],
    name: string,
    durationMs: number
}

export type RoomState = {
    id: string,
    queue: ITrack[],
    activeTrack: ITrack,
    loaded: false
};

const defaultState: RoomState = {};

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
                ...action.payload
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

export const createRoom = (token: string) => async dispatch => {
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

export const getRoom = (token: string, room: string) => async dispatch => {
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

export const queueTrack = (token: string) => async dispatch => {
    
};

/**
 * Looks for user's top tracks and queues one at random
 */
export const queueRecommendedTrack = (token: string) => async dispatch => {
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
        console.log(body.items[number])
        return body;
    }
    catch(ex) {
        dispatch(setError(ex));
        throw ex;
    }
};

