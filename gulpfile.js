'use strict';

const del = require('del');

const gulp = require('gulp');  
const sass = require('gulp-sass');  
const autoprefixer = require('gulp-autoprefixer');  
const refresh = require('gulp-refresh');  
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const server = require('gulp-develop-server');
const changed = require('gulp-changed');

const config = {
    buildDir: './build/',
    srcDir: './src/',
    templatesDir: 'views/',
    sassDir: 'sass/',
    assetsDir: 'static/'
};

var typescriptProject = typescript.createProject('tsconfig.json')

gulp.task('sass', () => {
    const DEST = config.buildDir + config.assetsDir + 'css/';
    return gulp
        .src(config.srcDir + config.sassDir + '**/*.sass')
        .pipe(changed(DEST))
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(DEST))
        .pipe(refresh());
});
gulp.task('sass:watch', () => {
    return gulp.watch(config.srcDir + config.sassDir + '**/*.sass', ['sass']);
});

gulp.task('pug', () => {
    const DEST = config.buildDir + config.templatesDir;
    return gulp
        .src(config.srcDir + config.templatesDir + '**/*.pug')
        .pipe(changed(DEST))
        .pipe(gulp.dest(DEST))
        .pipe(refresh());
});
gulp.task('pug:watch', () => {
    return gulp.watch(config.srcDir + config.templatesDir + '**/*.pug', ['pug'])
});

gulp.task('typescript', () => {
    return gulp
        .src(config.srcDir + '**/*.ts')
        .pipe(sourcemaps.init())
            .pipe(typescriptProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.buildDir));
});
gulp.task('typescript:watch', () => {
    return gulp.watch(config.srcDir + '**/*.ts', ['typescript'])
})

gulp.task('assets', () => {
    const DEST = config.buildDir + config.assetsDir;
    return gulp
        .src(config.srcDir + config.assetsDir + '**/*')
        .pipe(changed(DEST))
        .pipe(gulp.dest(DEST))
        .pipe(refresh())
})
gulp.task('assets:watch', () => {
    return gulp.watch(config.srcDir + config.assetsDir + '**/*', ['assets'])
})

gulp.task('refresh:watch', () => {
    refresh.listen();
});
gulp.task('watch', [
    'refresh:watch',
    'sass:watch',
    'pug:watch',
    'typescript:watch', 
    'assets:watch'
]);

gulp.task('build', [
    'sass',
    'pug',
    'typescript',
    'assets'
])

gulp.task('server:start', ['build'], () => {
    return server.listen({
        path: 'server.js',
        cwd: config.buildDir,
        successMessage: /^Server is listening/,
        env: {
            NODE_ENV: 'development',
            DEBUG: 'express:application,express:router',
            DEBUG_COLORS: true
        }
    })
})
gulp.task('server', ['server:start'], () => {
    return gulp.watch(config.buildDir + '**/*.js', server.restart)
})

gulp.task('serve', ['watch', 'server'])

gulp.task('clean', () => {
    return del(config.buildDir)
})
