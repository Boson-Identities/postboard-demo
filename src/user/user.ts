import * as Bluebird from 'bluebird';
import * as Debug from 'debug';

import { BosonToken } from '../boson/token';
import { Storage } from './storage';

const debug = Debug('postboard:user');

interface UserData {
    id: string;
    [index: string]: any;
}

export class User {
    private storage: Storage;

    constructor(storage: Storage) {
        this.storage = storage;
        if (!this.storage.user)
            this.storage.user = {};
    }

    get loggedIn() {
        return this.storage.user.token !== undefined;
    }

    get id(): string {
        return this.storage.user.data.id;
    }

    get friendlyId() {
        if (!this.loggedIn)
            return 'Not logged-in';
        return this.id.substr(0, 6) + '...';
    }

    get oauthToken(): BosonToken {
        return this.storage.user.token;
    }

    set oauthToken(token: BosonToken) {
        this.storage.user.token = token;
    }

    set data(data: UserData) {
        this.storage.user.data = data;
    }

    async save() {
        await Bluebird.fromCallback((callback) => this.storage.save(callback));
        debug('Saved user');
    }

    async logout() {
        this.storage.user = undefined;
        await this.save();
        debug('Logged out');
    }
}
