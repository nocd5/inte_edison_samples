var gulp = require('gulp');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var buffer = require('gulp-buffer');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');

gulp.task('default', function(){
  gulp.src('./src/layout/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(minifyCSS())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(gulp.dest('./public/css'));
  browserify({ entries: [ './src/script/main.js' ] })
    .transform(reactify)
    .bundle()
    .pipe(source('content.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./public'))
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(gulp.dest('./public'));
});

