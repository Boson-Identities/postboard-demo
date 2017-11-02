import { Token } from 'simple-oauth2';

export interface BosonToken extends Token {
    access_token: string;
    scope: string[];
    token_type: 'Bearer';
    expires_in: number;
    refresh_token: string;
}
