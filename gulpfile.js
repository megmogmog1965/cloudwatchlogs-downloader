var gulp = require('gulp');

gulp.task('copy', function() {
  gulp.src(['public/**/*', 'package.json'])
    .pipe(gulp.dest('dist'));
});
