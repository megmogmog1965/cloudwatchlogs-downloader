var gulp = require('gulp');

gulp.task('copy', function() {
  gulp.src(['public/**/*'])
    .pipe(gulp.dest('dist'));
});
