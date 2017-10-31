import { Router } from 'express';

import { BosonService, ROUTE } from './bosonservice';

export default (boson: BosonService) => {
    const router = Router();
    router.get(ROUTE, (req, res) => {
        boson.loginUser(req.query.code).then(
            (result) => {
                console.log(result);
                res.redirect('/');
                res.end();
            },
            (err) => {
                console.error('Token access error: ' + err.message);
                res.json('Authentication failed');
            })
    });

    return router;
}
