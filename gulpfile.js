/*jshint globalstrict: true*/
/*global require*/

'use strict';

var gulp = require('gulp');
var util = require('util');
var jdists = require('gulp-jdists');
var rename = require('gulp-rename');
var examplejs = require('gulp-examplejs');
var open = require('gulp-open');

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