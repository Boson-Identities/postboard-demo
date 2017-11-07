import { Request, Response, NextFunction } from 'express';
import { create as Oauth2Create, OAuthClient} from 'simple-oauth2';
import * as Bluebird from 'bluebird';
import * as Debug from 'debug';
import * as request from 'request';
import * as randomstring from 'randomstring';

import { Config } from '../config';
import { BosonToken } from './token';
import { User } from '../user/user';

const debug = Debug('postboard:boson');

const SCOPES = 'require:phone';
const AUTH_PATH = '/oauth2/authorize';
const TOKEN_PATH = '/oauth2/token';
const ME_ROUTE = '/api/v1/user/me';
export const ROUTE = '/_oauth/boson';


export class BosonService {
    private oauth2: OAuthClient;
    private bosonHost: string;
    private redirectUri: string;
    
    constructor(config: Config) {
        this.bosonHost = config.bosonHost;
        this.redirectUri = config.host + ROUTE;
        this.oauth2 = Oauth2Create({
            client: {
                id: config.bosonClientId,
                secret: config.bosonSecret
            },
            auth: {
                authorizePath: AUTH_PATH,
                tokenPath: TOKEN_PATH,
                tokenHost: config.bosonHost
            }
        });
    }

    loginUri(req: Request): string {
        req.session!!.oauthState = randomstring.generate();
        req.session!!.save(() => {})
        return this.oauth2.authorizationCode.authorizeURL({
            redirect_uri: this.redirectUri,
            scope: SCOPES,
            state: req.session!!.oauthState 
        });
    }

    requireUser() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const user = await this.userFromSession(req);
            if (!user.loggedIn) {
                res.redirect('/');
                res.end();
            } else
                next();
        }
    }

    async userFromSession(req: Request) {
        let user = new User(req.session!!);
        if (user.loggedIn)
            await this.refreshToken(user);
        return user;
    }

    // Takes oauth2 authorization code, returns a token
    async userFromAuthCode(callbackReq: Request) {
        debug('Logging Boson user, code: ', callbackReq.query.code);

        if (callbackReq.query.state !== callbackReq.session!!.oauthState) {
            throw new Error("Invalid state");
        }

        if (!callbackReq.query.code) {
            throw new Error("The request doesn\'t have the Boson's OAuth2 code");
        }
        const code = callbackReq.query.code;
        const token: BosonToken = (await this.oauth2.authorizationCode
            .getToken({code, redirect_uri: this.redirectUri})) as BosonToken;

        let user = new User(callbackReq.session!!);
        user.oauthToken = token;
        
        user.data = await this.api(user, ME_ROUTE);

        await user.save();
        return user;
    }

    private async refreshToken(user: User) {
        let token = this.oauth2.accessToken.create(user.oauthToken);
        if (token.expired()) {
            debug('Token expired, refreshing');

            // Throws error if not properly refreshed
            token = await token.refresh();
            user.oauthToken = token.token as BosonToken;
            await user.save();
        }
    }

    private async api(user: User, uri: string) {
        let res = await this.call(user, this.bosonHost + uri);
        return JSON.parse(res.body);
    }

    private async call(user: User, uri: string) {
        debug('Authorized call to: ', uri);

        if (!user.loggedIn)
            throw new Error('Tried authorized call with not logged-in user');

        const token = user.oauthToken;
        return await Bluebird.fromCallback((callback) => {
            request(uri, {
                headers: {
                    Authorization: `Bearer ${token.access_token}`
                },
                callback
            });
        });
    }
}
