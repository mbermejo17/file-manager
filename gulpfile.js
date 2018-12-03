var browserify = require('browserify');
var babelify = require('babelify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');

gulp.task('jsindex', function () {
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
      .on('error', util.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/'));
});

gulp.task('jsdashboard', function () {
    var b = browserify({
      entries: './js/dashboard.js',
      debug: true,
      transform: [babelify.configure({
        "presets": ['es2015'],
        "plugins": ["syntax-async-functions","transform-regenerator","transform-es2015-arrow-functions"]
      })]
    });
  
    return b.bundle()
      .pipe(source('./js/dashboard.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
        // Add other gulp transformations (eg. uglify) to the pipeline here.
        .on('error', util.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/'));
  });

  gulp.task('build', ['jsindex','jsdashboard']);