/// <binding />
var gulp = require("gulp");
var ts = require("gulp-typescript");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var plumber = require('gulp-plumber');
var babelify = require('babelify');
require("babel-core/register");
require("babel-polyfill");

// Plugins for CSS compoling
var sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS     = require('gulp-clean-css'),
    rename       = require('gulp-rename'),
    mmq          = require('gulp-merge-media-queries');

gulp.task("default", ['stylesheets'], function() {
  return gulp.watch(['./Client/**/*.ts', './Client/**/*.tsx', '!./node_modules/**'], () => {
        console.log("Compiling client-side.")
        browserify({
                basedir: '.',
                debug: true,
                entries: ['./Client/app.ts'],
                cache: {},
                packageCache: {},
                standalone: 'app'
            })
            .plugin(tsify, { module: "commonjs", jsx: "react", target: "es6" })
            .on('error', console.log)
            .transform(babelify.configure({
                presets: [
                    ['es2015'],
                    ['react'],
                    ["react"]
                ],
                plugins: [
                    ["transform-runtime", {
                        "polyfill": false,
                        "regenerator": true
                    }]
                ],
                extensions: ['.js', '.ts', '.jsx', '.tsx'],
                ignore: /(bower_components)|(node_modules)/
            }))
            .on('error', console.log)
            .bundle()
            .on('error', console.log)
            .pipe(source('site.js'))
            .on('error', console.log)
            .pipe(buffer())
            .on('error', console.log)
            .pipe(sourcemaps.init({ loadMaps: true }))
            .on('error', console.log)
            .pipe(sourcemaps.write('./'))
            .on('error', console.log)
            .pipe(gulp.dest("./wwwroot/js"))
            .on('end', () => console.log("Finished client-side compilation."));
    }).on('error', console.log);
});


gulp.task("once", ['stylesheets'], function() {
    return browserify({
            basedir: '.',
            debug: true,
            entries: ['Client/app.ts'],
            cache: {},
            packageCache: {},
            standalone: 'app'
        })
        .plugin(tsify, { module: "commonjs", jsx: "react", target: "es6" })
        .transform(babelify.configure({
            presets: [
                ['es2015'],
                ['stage-0'],
                ['react']
            ],
            plugins: [
                ["transform-runtime", {
                    "polyfill": false,
                    "regenerator": true
                }]
            ],
            extensions: ['.js', '.ts', '.jsx', '.tsx'],
            ignore: /(bower_components)|(node_modules)/
        }))
        .bundle()
        .pipe(source('site.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./wwwroot/js"))
        .on('end', () => console.log("Finished client-side compilation."));
});


// Compile Stylesheets
gulp.task('stylesheets', function() {
    return gulp.src('./Client/stylesheets/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(mmq({log: false}))
        .pipe(autoprefixer({browsers: ['> 2%', 'last 2 versions'], cascade: false}))
        .pipe(gulp.dest("./wwwroot/css"))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS())
        .pipe(gulp.dest("./wwwroot/css"))
});


// Watch Stylesheets
gulp.task('stylesheets-watch', function(callback) {
    gulp.watch('./Client/stylesheets/**/*.scss', ['stylesheets']);
});
