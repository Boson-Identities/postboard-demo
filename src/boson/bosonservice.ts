import { create as Oauth2Create, OAuthClient } from 'simple-oauth2';
import Promise = require('bluebird');

import { Config } from '../config';

const SCOPES = 'require:phone';
const AUTH_PATH = '/oauth2/authorize';
const TOKEN_PATH = '/oauth2/token';
export const ROUTE = '/_oauth/boson';

export class BosonService {
    private oauth2: OAuthClient;
    private redirectUri: string;
    
    get loginUri(): string {
        return this.oauth2.authorizationCode.authorizeURL({
            redirect_uri: this.redirectUri,
            scope: SCOPES
        });
    }

    constructor(config: Config) {
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

    // Takes oauth2 authorization code, returns a token
    loginUser(code: string): Promise<string> {
        return this.oauth2.authorizationCode
            .getToken({code, redirect_uri: this.redirectUri})
            .then((token) => {
                console.log(token);
                return token.access_token;
            })
    }
}
