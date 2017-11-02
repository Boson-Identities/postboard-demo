import { Router } from 'express';
import { BosonService } from '../boson/bosonservice';

export default (boson: BosonService) => {
    const router = Router();
    router.get('/', async (req, res) => {
        const user = await boson.userFromSession(req);
        res.render('index', {
            bosonLoginUri: boson.loginUri,
            user,
            shouts: []
        })
    });
    return router;
}
