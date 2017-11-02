import { Router } from 'express';

import { BosonService, ROUTE } from './bosonservice';

export default (boson: BosonService) => {
    const router = Router();
    router.get(ROUTE, async (req, res) => {
        try {
            await boson.userFromAuthCode(req);
        } catch(err) {
            console.trace('Error during user login', err);
            return res.json('Authentication failed');
        }
        res.redirect('/');
        return res.end();
    });

    return router;
}
