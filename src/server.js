import React from 'react';
import callback from './handlers/callback';
import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import api from './handlers/api';
import { renderToString } from 'react-dom/server';
import { matchPath, StaticRouter } from 'react-router-dom';
import App from './components/App';
import routes from './routes';
import './orm';
import 'universal-fetch';
import createStore from './createStore';
import morgan from 'morgan';
import serialize from 'serialize-javascript';
import { isURL } from 'validator';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const dev = process.env.NODE_ENV !== 'production';
const router = express();
const { URL } = require('url');

router.use(morgan(dev ? 'dev' : 'combined'));

router.use(bodyParser.json());
router.use(expressValidator({
    customValidators: {
        isArray: value => Array.isArray(value),
        isValidArtistsArray: (values) => !!values && values.every(value => typeof value.id === 'string' && typeof value.name === 'string'),
        isValidImagesArray: (values) =>
            !!values && values.every(value => (
                typeof value.height === 'number'
                && typeof value.width === 'number'
                && typeof value.url === 'string' &&
                isURL(value.url, {
                    host_whitelist: ['i.scdn.co'],
                    protocols: ['https']
                })
            ))
    }
}));

router.get('/callback', (...args) => callback(...args));
router.get('/favicon.ico', (req, res) => res.status(404).send(null));
router.use('/api', api);

router.use(express.static(process.env.RAZZLE_PUBLIC_DIR));
router.get('/*', async (req, res, next) => {
    try {
        const context = {};
        const store = await createStore();
        const promises = [];
        routes.some(route => {
            const url = new URL(req.url, process.env.RAZZLE_CAMPFIRE_BASE_URL);
            const { pathname } = url;
            const match = matchPath(pathname, route);
            if (match && route.component.getData) {
                promises.push(route.component.getData({ match, store }));
            }
            return match;
        });

        await Promise.all(promises);
        
        const markup = renderToString(
            <StaticRouter context={context} location={req.url}>
                <App store={store}/>
            </StaticRouter>
        );
        if (context.url) {
            res.redirect(context.url);
        } else {
            res.status(200).send(
                `<!doctype html>
        <html lang="">
        <head>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <title>Welcome to Razzle</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script>window.__initialState = ${serialize(store.getState())};</script>
            <script src="${assets.client.js}" defer></script>
        </head>
        <body>
            <div id="root">${markup}</div>
        </body>
    </html>`);
        }
    }
    catch (ex) {
        next(ex);
    }
});

export default router;