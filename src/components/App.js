// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from '../routes';
import type { Store } from 'redux';
import { Provider } from 'react-redux';

type AppProps = {
    store: Store
};

const App = (props: AppProps) => (
    <Provider store={props.store}>
        <Switch>
            {routes.map((route, index) => <Route key={index} {...route}/>)}
        </Switch>
    </Provider>
);

export default App;