// @flow

// state def

export type ErrorState = ?Error;

const defaultState: ErrorState = null;

export type Action = SetErrorAction;

// actions
type SetErrorAction = {
    type: 'SET_ERROR',
    payload: Error
};

// reducer

export default (state: ErrorState = defaultState, action: Action) => {
    switch (action.type) {
        case 'SET_ERROR':
            return action.payload;
        default:
            return state;
    }
};

// action creators
export const setError = (error: Error): SetErrorAction => ({
    type: 'SET_ERROR',
    payload: error
});