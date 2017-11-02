import { check, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import { Request, Response } from 'express';

import { MAX_SHOUT_LENGTH, MAX_TITLE_LENGTH} from '../constants';
import { Router } from 'express';
import { BosonService } from '../boson/bosonservice';
import { Shout } from '../shouts/shout';
import { ShoutService } from '../shouts/shoutservice';

export default (boson: BosonService, shoutService: ShoutService) => {
    const router = Router();
    router.use(boson.requireUser());

    router.get('/logout', async (req, res) => {
        const user = await boson.userFromSession(req);
        await user.logout()
        res.redirect('/');
    })
    router.post('/post', [
        check('title').isLength({max: MAX_TITLE_LENGTH, min: 3}).withMessage("The title must be between 3 and 20 chars"),
        check("shout").isLength({max: MAX_SHOUT_LENGTH, min: 3}).withMessage("The shout must be between 3 and 70 chars")
    ], async (req: Request, res: Response) => {
        const user = await boson.userFromSession(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() })
        }

        const data = matchedData(req);
        const shout: Shout = {
            title: data.title as string,
            subtitle: user.friendlyId,
            text: data.shout as string
        };

        await shoutService.newShout(user, shout);

        res.redirect('/');
        return res.end();
    })
    
    return router;
}
