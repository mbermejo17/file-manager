import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import watch from 'gulp-watch';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import buffer from 'vinyl-buffer';
import nodemon from 'gulp-nodemon';


const postcssPlugins = [
    cssnano({
        core: false, // true for minified output
        autoprefixer: {
            add: true,
            browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'
        }
    })
];


const server = browserSync.create();


// Scripts
gulp.task('scripts1', () => {
    var b = browserify({
        entries: './js/logon.js',
        debug: true,
        transform: [babelify.configure({
            presets: ['es2015']
        })]
    });

    return b.bundle()
        .pipe(source('./js/logon.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        // Add other gulp transformations (eg. uglify) to the pipeline here.
        //.on('error', util.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/'));
});


gulp.task('scripts2', () =>
    browserify('./js/dashboard.js', {
        standalone: 'dashboard'
    })
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
        console.error(err);
        this.emit('end')
    })
    .pipe(source('dashboard.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js'))
);

gulp.task('scripts', ['scripts1', 'scripts2']);


// Sass
gulp.task('styles1', () =>
    gulp.src('./src/scss/style.scss')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss(postcssPlugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
    .pipe(server.stream({ match: '**/*.css' }))
);

gulp.task('styles2', () =>
    gulp.src('./src/scss/dashboard.scss')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss(postcssPlugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
    .pipe(server.stream({ match: '**/*.css' }))
);

gulp.task('styles', ['styles1', 'styles2']);

gulp.task('build', ['jsindex', 'jsdashboard']);

gulp.task('start', ['browser-sync'], function() {});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "https://localhost:8443",
        files: ["public/**/*.*"],
        port: 7000,
    });
});


gulp.task('nodemon', function(cb) {

    var started = false;


    watch('./scss/**/*.scss', () => gulp.start('styles', browserSync.reload()));
    watch('./js/**/*.js', () => gulp.start('scripts', browserSync.reload()));
    //watch('./src/examples/**/*.pug', () => gulp.start('pug', browserSync.reload()));

    return nodemon({
        script: 'server.js'
    }).on('start', function() {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});