'use strict';

const gulp = require('gulp'); 
const gutil = require('gulp-util');

const del = require('del');
const runSequence = require('run-sequence');

const insert = require('gulp-insert');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');

const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const jade = require('gulp-jade'); 

const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();

gulp.task('clean', () => {
    return del('./public/**/*');
});

gulp.task('img', () => {
    return gulp.src(['./src/img/**/*'])
        .pipe(gulp.dest('./public/img'));
});

gulp.task('scss', () => {

    const plugins = [
        require('autoprefixer'),
        require('cssnano')
    ];

    return gulp.src(['./src/scss/**/*.scss', './libs/harmony/src/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('jade', () => {

    const pages = [
        './src/**/*.jade',
        '!./src/includes/**/*.jade'
    ];

    return gulp.src(pages)
        .pipe(jade({
            pretty: true
        }))
        .on('error', function (err) {
            gutil.log(gutil.colors.red(err));
            gutil.beep();
            this.emit('end');
        })
        .pipe(gulp.dest('./public'));
});

gulp.task('js', () => {

    const scripts = [
        './libs/jquery/dist/jquery.js',
        './libs/lodash/lodash.js',
        './libs/moment/moment.js',
        './libs/firebase/firebase.js',
        './libs/angular/angular.js',
        './libs/angular-ui-router/release/angular-ui-router.js',
        './libs/angularfire/dist/angularfire.js',
        './libs/angular-moment/angular-moment.js',
        './src/js/app.js',
        './src/js/**/*.js'
    ];

    return gulp.src(scripts)
        .pipe(sourcemaps.init())
        .on('error', (err) => {
            gutil.log(gutil.colors.red('[Compilation Error]'));
            gutil.log(gutil.colors.red(err.message));
        })
        .pipe(concat('playste.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('nodemon', (cb) => {
    const started = false;
    return nodemon({
        script: 'server.js'
    }).on('start', () => {
        if (!started) {
            cb();
            started = true; 
        } 
    });
});

gulp.task('browser-sync', ['nodemon'], () => {
    browserSync.init(['./public/css/**/*.css', './public/js/**/*.js', './public/**/*.html'], {
        proxy: 'http://localhost:5000',
        files: ['public/**/*.*'],
        notify: false
    });
});

// gulp.task('browser-sync', ['nodemon'], () => {
//     browserSync.init(null, {
//         proxy: 'http://localhost:5000',
//         files: ['public/**/*.*'],
//         browser: 'google chrome',
//         port: 7000,
//     });
// });

gulp.task('build', cb => {
    return runSequence('clean', 'img', ['jade', 'scss', 'js'], cb);
});

gulp.task('watch', () => {
    gulp.watch('img/**/*', {cwd: './src'}, ['imgs']);
    gulp.watch('scss/**/*.scss', {cwd: './src'}, ['scss']);
    gulp.watch('js/**/*.js', {cwd: './src'}, ['js']);
    gulp.watch('**/*.jade', {cwd: './src'}, ['jade']);
});

gulp.task('serve', cb => {
    runSequence('build', ['browser-sync', 'watch'], cb)
});

// gulp.task('serve', ['assets', 'img', 'sass', 'jade', 'vendor-js', 'app-js', 'browser-sync'], () => {
//     gulp.watch('img/**/*', {cwd: './src'}, ['imgs']);
//     gulp.watch('scss/**/*.scss', {cwd: './src'}, ['sass']);
//     gulp.watch('**/*.jade', {cwd: './src'}, ['jade']);
//     gulp.watch('js/**/*', {cwd: './src'}, ['app-js']);
// });