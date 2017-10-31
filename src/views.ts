import * as express from 'express';

import home from './home/views';
import boson from './boson/views';

import { BosonService } from './boson/bosonservice';
import { Config } from './config';

export default (config: Config) => {
    const bosonService = new BosonService(config);

    // Routes
    const router = express.Router();
    router.use('/static', express.static('static'))
    router.use('/', home(bosonService))
    router.use('/', boson(bosonService))
    return router;
}
