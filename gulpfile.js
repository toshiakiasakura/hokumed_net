// This is a learning purpose. 
var gulp = require('gulp');
var pug = require('gulp-pug');

gulp.task('one', function(done) {
    console.log('task one');
    done();
});

gulp.task('two', function(done) {
    console.log('task two');
    done();
});


// Usage of pug.
gulp.task('pugIndexToHtml', function (){
   return gulp.src('client/index.pug')
  .pipe(pug({
     pretty: true
  }))
  .pipe(gulp.dest('./dest'));
});

gulp.task('pugToHtml', function(){
    return gulp.src('client/**/*.pug')
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('client'))
});

gulp.task('default', 
    gulp.series('one', 'two', 'pugIndexToHtml', 'pugToHtml'));
