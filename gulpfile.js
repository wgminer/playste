var gulp = require('gulp'); 
var gutil = require('gulp-util');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jade = require('gulp-jade');

var browserSync = require('browser-sync').create();

gulp.task('img', function() {
    return gulp.src(['./src/app/img/**/*'])
        .pipe(gulp.dest('./build/app/img'));
});

gulp.task('assets', function() {
    return gulp.src(['./libs/harmony/src/assets/**/*'])
        .pipe(gulp.dest('./build/app/assets'));
});

gulp.task('sass', function () {

    var plugins = [
        require('autoprefixer'),
        require('cssnano')
    ];

    return gulp.src(['./src/app/scss/**/*.scss', './libs/harmony/src/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./build/app/css'));
});

gulp.task('jade', function() {
    return gulp.src(['./src/app/**/*.jade'])
        .pipe(jade())
        .pipe(gulp.dest('./build/app'));
});

gulp.task('json', function() {
    return gulp.src(['./src/app/js/**/*.json'])
        .pipe(gulp.dest('./build/app/js'));
});

gulp.task('vendor-js', ['json'], function () {

    var vendor = [
        './libs/jquery/dist/jquery.js',
        './libs/lodash/lodash.js',
        './libs/firebase/firebase.js',
        './libs/angular/angular.js',
        './libs/angular-ui-router/release/angular-ui-router.js',
        './libs/angularfire/dist/angularfire.js',
    ];

    gulp.src(vendor)
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/app/js'))
});

gulp.task('app-js', function () {
    return gulp.src('./src/app/js/**/*.js')
        .pipe(gulp.dest('./build/app/js'))
});



gulp.task('browser-sync', function() {
    browserSync.init(['./build/app/css/**/*.css', './build/app/js/**/*.js', './build/app/**/*.html'], {
        notify: false,
        server: {
            baseDir: './build/app',
            routes: {
                '/libs': 'libs'
            }
        }
    });
});

gulp.task('serve', ['assets', 'img', 'sass', 'jade', 'vendor-js', 'app-js', 'browser-sync'], function () {
    gulp.watch('img/**/*', {cwd: './src/app'}, ['imgs']);
    gulp.watch('scss/**/*.scss', {cwd: './src/app'}, ['sass']);
    gulp.watch('**/*.jade', {cwd: './src/app'}, ['jade']);
    gulp.watch('js/**/*', {cwd: './src/app'}, ['app-js']);
});