import { parse } from 'url';
import next from 'next';
import callback from './handlers/callback';
import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import api from './handlers/api';
import './orm';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const router = express();

app.prepare().then(() => {
    router.use(bodyParser.json());
    router.use(expressValidator());

    router.get('/callback', (...args) => callback(app, ...args));
    router.use('/api', api);

    router.get('/:roomName', function (req, res) {
        const parsedUrl = parse(req.url, true);
        const { query } = parsedUrl;
        app.render(req, res, '/room', query);
    });

    router.use((req, res) => {
        // default fallback: let next handle the request 
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    router.listen(3000, function () {
        console.log('> Ready on http://localhost:3000');
    });
});

