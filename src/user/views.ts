import { Router } from 'express';
import { BosonService } from '../boson/bosonservice';

export default (boson: BosonService) => {
    const router = Router();
    router.use(boson.requireUser());

    router.get('/logout', async (req, res) => {
        const user = await boson.userFromSession(req);
        await user.logout()
        res.redirect('/');
    })
    router.post('/post', async (req, res) => {
    })
    
    return router;
}
