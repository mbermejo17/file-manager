//const gulp = require('gulp')
import gulp from 'gulp'
import browserSync from 'browser-sync'
import plumber from 'gulp-plumber'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import jsmin from 'gulp-jsmin'
import imagemin from 'gulp-imagemin'

//Métodos de gulp
/*
  gulp.task('tarea', () => {}) - define una tarea
  gulp.src('archivo origen') - define el origen
  gulp.dest('archivo origen') - define el destino
  gulp.pipe() - utilizar un plugin o funcionalidad para gulp
  gulp.watch('archivo origen') - vigilar u observar tareas o archivos y directorios
*/

const reload = browserSync.reload,
  reloadFiles = [
    './dist/public/js/script.js',
    './dist/public/css/style.css',
    './dist/app/**/*.js',
    './dist/public/*.html',
    './*.js'
  ], proxyOptions = {
    server: {
      baseDir: "./dist/public"
    },
    browser: 'chrome',
    notify: false
  }, imageminOptions = {
    progressive: true,
    optimizationLevel: 3, // 0-7, low-high
    interlaced: true,
    svgPlugins: [{ removeViewBox: false }]
  }

gulp.task('server', () => browserSync.init(reloadFiles, proxyOptions))

gulp.task('css', () => {
  gulp.src('./src/scss/style.scss')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/public/css'))
    .pipe(reload({ stream: true }))
})

gulp.task('js', () => {
  browserify('./src/js/index.js')
    .transform(babelify)
    .bundle()
    .on('error', err => console.log(err.message))
    .pipe(source('script.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(jsmin())
    .pipe(gulp.dest('./dist/public/js'))
    .pipe(reload({ stream: true }))
})

gulp.task('jslogon', () => {
  browserify('./src/js/logon.js')
    .transform(babelify)
    .bundle()
    .on('error', err => console.log(err.message))
    .pipe(source('logon.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(jsmin())
    .pipe(gulp.dest('./dist/public/js'))
    .pipe(reload({ stream: true }))
})


gulp.task('img', () => {
  gulp.src('./src/img/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe(imagemin(imageminOptions))
    .pipe(gulp.dest('./dist/public/img'))
})

gulp.task('default', ['server', 'css', 'js'], () => {
  gulp.watch('./src/scss/**/*.+(scss|css)', ['css'])
  gulp.watch('./src/js/**/*.+(js|json)', ['js','jslogon'])
})
