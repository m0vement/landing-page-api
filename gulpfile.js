var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('test', function() {
  return gulp.src(['test/**/*.js', 'test/mocks/*.js']).pipe($.lab('-T node_modules/lab-babel'));
});

gulp.task('tdd', ['test'], function() {
  gulp.watch('{src,test}/**/*.js', ['test']);
});