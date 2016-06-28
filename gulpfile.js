/*jshint globalstrict: true*/
/*global require*/

'use strict';

var gulp = require('gulp');
var jdists = require('gulp-jdists');
var examplejs = require('gulp-examplejs');

gulp.task('build', function() {
  return gulp.src(['src/**.js'])
    .pipe(jdists({
      trigger: 'release'
    }))
    .pipe(gulp.dest('./lib'));
});

gulp.task('example', function() {
  return gulp.src('src/**.js')
    .pipe(examplejs({
      head: 'examplejs-head.js'
    }))
    .pipe(gulp.dest('test'));
});

gulp.task('default', ['build']);