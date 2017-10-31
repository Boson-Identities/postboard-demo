
export interface Config {
    host: string;
    sessionSecret: string;

    bosonHost: string;
    bosonClientId: string;
    bosonSecret: string;
}

let config: Config = require('../config.json')

export default config
