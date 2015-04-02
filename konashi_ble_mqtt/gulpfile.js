var gulp = require('gulp');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var buffer = require('gulp-buffer');

gulp.task('default', function(){
  // if relative-path is given to `entries`,
  // fail gulp command on Heroku.
  return browserify({ entries: [ __dirname + '/src/main.js' ] })
    .transform(reactify)
    .bundle()
    .pipe(source('content.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./public'))
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(gulp.dest('./public'));
});

