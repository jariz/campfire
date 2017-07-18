import App from './components/App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { render } from 'react-dom';
import createStore from './createStore';

createStore(window.__initialState).then(store => {
    render(
        <BrowserRouter >
            <App store={store} />
        </BrowserRouter>,
        document.getElementById('root')
    );

    if (module.hot) {
        module.hot.accept();
    }

});