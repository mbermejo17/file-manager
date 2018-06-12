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
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';

const server = browserSync.create();

const sassOptions = {
    outputStyle: 'expanded'
};

const postcssPlugins = [
    cssnano({
        core: false,
        autoprefixer: {
            add: true,
            browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'
        }
    })
];

gulp.task('styles', () =>
    gulp.src('./src/scss/style.scss')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(plumber())
    .pipe(sass(sassOptions))
    .pipe(postcss(postcssPlugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
    .pipe(server.stream({ match: '**/*.css' }))
);

gulp.task('pug', () =>
    gulp.src('./src/app/views/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('./public'))
);

gulp.task('script', () =>
    browserify('./src/js/index.js')
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
    .pipe(gulp.dest('./src/public/js'))
);

gulp.task('scriptlogon', () =>
    browserify('./src/js/logon.js')
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
        console.error(err);
        this.emit('end')
    })
    .pipe(source('logon.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src/public/js'))
);
gulp.task('default', () => {
    server.init({
        server: {
            baseDir: './public'
        },
    });

    watch('./src/scss/**/*.scss', () => gulp.start('styles'));
    watch('./src/js/**/*.js', () => gulp.start('scripts', server.reload));
    watch('./src/pug/**/*.pug', () => gulp.start('pug', server.reload));
});


gulp.task('css', () => {
    gulp.src('./src/scss/style.scss')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/public/css'))
})
gulp.task('cssdashboard', () => {
    gulp.src('./src/scss/dashboard.scss')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/public/css'))
})