# Postboard demo
This demo showcases Boson.me possibilites by allowing anonymous users to post on a post-board
while still mainitainig uniquness (which is verified by a phone).

This allows the post-board to not need any user data and fight with regulators while still providing for example proper moderation service 

## Prepare your config
This application expects you to write connfig.json file in the main directory to suit your needs. For example:

    {
        "host": "http://127.0.0.1:8080",
        "sessionSecret": "a keyboard cat",
        "bosonHost": "http://boson:8000",
        "bosonClientId": "VEdGtBdAkppQKNLMijqYw2fO2GvuRWjd",
        "bosonSecret": "EIihjJ1cXWFQltb2s0YB0CYeOYcAPWry"
    }

To properly configure settings and see what's needed, please see `src/config.ts`

## Start serve server

    npm install
    npm run serve

Enjoy your server responsibly on 127.0.0.1:8080

The server supports hot-reloading of assets, typescript and auto-refreshing your browser
using livereload

### Run development in Docker

    docker-compose -f docker-compose-dev.yml build
    docker-compose -f docker-compose-dev.yml up

Keep in mind that development env expects you to have Boson running in another docker compose
somewhere. It will try to connect to boson_world network

## Create compiled files and production env

    npm install
    npm install -g gulp-cli
    gulp build
    docker-compose -f docker-compose-prod.yml build
    docker-compose -f docker-compose-prod.yml up
