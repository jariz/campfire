// @flow

import { meUrl } from '../constants/apiUrls';
import throwIfNotOK from '../services/throwIfNotOK';
import { setError } from './error';
// state def

export type UserState = {
    token: string,
    profile: {
        displayName: string,
        id: string,
        image: string,
        spotifyId: string
    }
};

export type IProfile = {
    displayName: null,
    id: null,
    image: null,
    spotifyId: null
};

const defaultState: UserState = {
    token: null,
    profile: {
        displayName: null,
        id: null,
        image: null,
        spotifyId: null
    }
};

export type Action = SetTokenAction | SetProfileAction;

// actions
type SetTokenAction = {
    type: 'SET_TOKEN',
    payload: {
        token: string
    }
};

type SetProfileAction = {
    type: 'SET_PROFILE',
    payload: IProfile
};

// reducer

export default (state: UserState = defaultState, action: Action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

// action creators
export const setToken = (token: string): SetTokenAction => ({
    type: 'SET_TOKEN',
    payload: {
        token
    }
});

export const setProfile = (profile: IProfile): SetProfileAction => ({
    type: 'SET_PROFILE',
    payload: profile
});

export const getProfile = (token: string) => async (dispatch) => {
    try {
        const resp = await fetch(meUrl(), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        throwIfNotOK(resp);
        const body = await resp.json();
        dispatch(setProfile(body));
    }
    catch(ex) {
        dispatch(setError(ex));
    }
};