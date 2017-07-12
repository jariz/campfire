// @flow

import throwIfNotOK from '../services/throwIfNotOK';
import { createRoomUrl } from '../constants/apiUrls';
import { setError } from './error';
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
    coverImage: string,
    coverColor: string,
    images: ITrack[],
    name: string,
    trackName: string,
    durationMs: number
}

export type RoomState = {
    id: string,
    queue: ITrack[],
    activeTrack: ITrack
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
        const body = await resp.json();
        // dispatch(setRoom(body));
        return body;
    }
    catch(ex) {
        dispatch(setError(ex));
        throw ex;
    }
};