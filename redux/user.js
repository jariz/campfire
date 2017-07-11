// @flow

// state def

export type UserState = {};

const defaultState: UserState = {};

export type Action = null;

// actions


// reducer

export default (state: UserState = defaultState, action: Action) => {
    switch (action.type) {
        default:
            return state;
    }
};

// action creators
