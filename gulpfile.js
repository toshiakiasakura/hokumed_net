// This is a learning purpose. 
var gulp = require('gulp');

gulp.task('one', function(done) {
    console.log('task one');
    done();
});

gulp.task('two', function(done) {
    console.log('task two');
    done();
});

gulp.task('default', gulp.series('one', 'two', function(done) {
    console.log('task default');
    done();
}));
