
/* == LESS, for Bootstrap =====*/

var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
 
gulp.task('less', function () {
  return gulp.src('assets/less/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default',function() {
    gulp.watch('assets/less/*.less',['less']);
    
});
