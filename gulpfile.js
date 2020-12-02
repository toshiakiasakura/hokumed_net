var gulp = require('gulp');
var pug = require('gulp-pug');

gulp.task('pugToHtml', function(){
    return gulp.src('views/**/*.pug')
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('views'))
});

function test(){
    return gulp.src('views/write.pug')
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('views'))
};
exports.test = test;

gulp.task('default', 
    gulp.series('pugToHtml'));

