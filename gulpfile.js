var gulp = require('gulp');
var jeditor = require("gulp-json-editor");

gulp.task('copy', function() {
  gulp.src(['public/**/*'])
    .pipe(gulp.dest('dist'));

  gulp.src('package.json')
    .pipe(jeditor(function(json) {
      json.devDependencies = {};
      json.dependencies = {};
      return json;
    }))
    .pipe(gulp.dest('dist'));
});
