import * as express from "express";
import * as redis from "redis";
import * as bluebird from 'bluebird';
import * as session from 'express-session';
import * as connectredis from 'connect-redis';

import config from './config';
import views from './views';

bluebird.promisifyAll(redis.Multi);
bluebird.promisifyAll(redis.RedisClient);
const redisClient = redis.createClient({
    host: 'cache'
});
redisClient.on("error", function (err) {
    console.log("Error " + err);
});

const app = express()
app.set('view engine', 'pug')

const RedisStore = connectredis(session);
app.use(session({
    store: new RedisStore({client: redisClient }),
    secret: config.sessionSecret,
    cookie: {
        maxAge: 604800000 // 1 week
    },
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
   res.locals.production = app.get('env') == 'production';
   res.locals.development = app.get('env') == 'development'; 
   next();
})

app.use('/', views(config))

app.listen(8080, () => {
    console.log('Server is listening on 8080')
})
