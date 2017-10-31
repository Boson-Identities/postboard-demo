import { Router } from 'express';
import { BosonService } from '../boson/bosonservice';

export default (boson: BosonService) => {
    const router = Router();
    router.get('/', (req, res) => {
        res.render('index', {
            bosonLoginUri: boson.loginUri,
            shouts: []
        })
    });
    return router;
}
