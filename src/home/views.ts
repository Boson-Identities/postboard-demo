import { Router } from 'express';

import { MAX_SHOUT_LENGTH, MAX_TITLE_LENGTH } from '../constants';
import { BosonService } from '../boson/bosonservice';
import { ShoutService } from '../shouts/shoutservice';

export default (boson: BosonService, shoutService: ShoutService) => {
    const router = Router();
    router.get('/', async (req, res) => {
        const user = await boson.userFromSession(req);
        const shouts = await shoutService.all();
        res.render('index', {
            bosonLoginUri: boson.loginUri(req),
            user,
            MAX_SHOUT_LENGTH,
            MAX_TITLE_LENGTH,
            shouts
        });
    });
    return router;
}
