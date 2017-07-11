// @flow

// state def

export type ErrorState = {};

const defaultState: ErrorState = {};

export type Action = null;

// actions


// reducer

export default (state: ErrorState = defaultState, action: Action) => {
    switch (action.type) {
        default:
            return state;
    }
};

// action creators
