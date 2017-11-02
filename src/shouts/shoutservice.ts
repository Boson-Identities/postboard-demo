import * as Debug from 'debug';

import { Shout } from './shout';
import { User } from '../user/user';
import { MAX_SHOUT_LENGTH, MAX_TITLE_LENGTH} from '../constants';

const debug = Debug('postboard:shout');

// No love for promisify in Typescript
interface RedisAsync {
    lpushAsync(name: string, data: string): Promise<number>;
    lrangeAsync(name: string, start: number, end: number): Promise<string[]>;
}

const REDIS_KEY = 'shouts';

export class ShoutService {
    private redis: RedisAsync;

    constructor(redis: RedisAsync) {
        this.redis = redis;
    }

    async all() {
        let result: Shout[] = [];
        for (let data of await this.redis.lrangeAsync(REDIS_KEY, 0, -1)) {
            result.push(JSON.parse(data));
        }
        return result;
    }

    async newShout(user: User, shout: Shout) {
        debug('Adding new shout by: ', user.id);
        if (shout.title.length > MAX_TITLE_LENGTH) 
            throw new Error("Title too long");
        if (shout.text.length > MAX_SHOUT_LENGTH)
            throw new Error("Shout too long");
        shout.subtitle = user.friendlyId;
        const serialized = JSON.stringify(shout);

        await this.redis.lpushAsync(REDIS_KEY, serialized);
    }
}
