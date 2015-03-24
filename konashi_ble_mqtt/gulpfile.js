var gulp = require('gulp');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var buffer = require('gulp-buffer');

gulp.task('browserify', function(){
  var b = browserify({
    entries: ['./src/main.js'],
    transform: [reactify]
  });
  return b.bundle()
    .pipe(source('content.js'))
    .pipe(rename({extname: ".min.js"}))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public'));
});
