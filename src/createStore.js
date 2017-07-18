import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import user from './redux/user';
import { autoRehydrate, persistStore } from 'redux-persist';
import isServer from './services/isServer';
import thunk from 'redux-thunk';
import room from './redux/room';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export default (initial) => new Promise(resolve => {
    const store = createStore(
        combineReducers({
            user,
            room
        }),
        initial || {},
        composeEnhancers(
            applyMiddleware(thunk),
            autoRehydrate()
        )
    );

    if (!isServer) {
        persistStore(store, {
            whitelist: ['user']
        }, () => {
            resolve(store);
        });
    } else {
        resolve(store);
    }
});