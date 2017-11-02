import * as express from 'express';

import home from './home/views';
import boson from './boson/views';
import user from './user/views';

import { ShoutService } from './shouts/shoutservice';
import { BosonService } from './boson/bosonservice';
import { Config } from './config';

export default (config: Config, redisAsync: any) => {
    const bosonService = new BosonService(config);
    const shoutsService = new ShoutService(redisAsync);

    // Routes
    const router = express.Router();
    router.use('/static', express.static('static'))
    router.use('/', home(bosonService, shoutsService))
    router.use('/', boson(bosonService))
    router.use('/user', user(bosonService, shoutsService));
    return router;
}
