//gulp
var gulp = require('gulp'); 

//gulp plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean'); 

//lint task
gulp.task('hint',function() {
    return gulp.src('scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default')); 
});

//compile sass into css and store in dist/css
gulp.task('sass',function() { 
     gulp.src('scss/main.scss')
        .pipe(sass({outputStyle: 'compressed', file: 'main.scss'}).on('error',sass.logError))
        .pipe(gulp.dest('dist'));
}); 

// Concatenate and minify javascript and store in dist/js 
gulp.task('scripts',function() { 
    return gulp.src('scripts/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist')); 
}); 

// setup watch loop
gulp.task('watch',function() { 
    gulp.watch('scripts/*.js',['hint','scripts']); 
    gulp.watch('scss/*scss',['sass']); 
});

// default task 'gulp'
gulp.task('default',['hint','sass','scripts','watch']); 




