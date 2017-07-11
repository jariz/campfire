import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import user from './redux/user';
import { autoRehydrate, persistStore } from 'redux-persist';
import isServer from './services/isServer';
import thunk from 'redux-thunk';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export default (initialState) => {
    const store = createStore(combineReducers({
        user
    }), initialState,
    composeEnhancers(
        applyMiddleware(thunk),
        autoRehydrate()
    ));
    
    if(!isServer) {
        persistStore(store, {
            whitelist: ['user']
        });
    }

    return store;
};