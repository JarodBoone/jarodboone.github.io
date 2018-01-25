//gulp
var gulp = require('gulp'); 

//gulp plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean'); 

//gulp-sass is compiling css files for every scss file even though I import all my 
//scss files in main.scss (and therefore they are already in main.css). You're out of you're 
//godamn mind if you think I'm going to try and debug a wrapper of a wrapper of a sass port
//just going to grossly clean an array of css file names
var killMe = ['dist/gol.css','dist/mixin.css','scss/useless.scss'];

//lint task
gulp.task('hint',function() {
    return gulp.src('scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default')); 
});

//compile sass into css and store in dist/css
gulp.task('sass',function() { 
     gulp.src('scss/*.scss')
        .pipe(sass({outputStyle: 'compressed', file: 'main.scss'}).on('error',sass.logError))
        .pipe(gulp.dest('dist'))
        .on('end',function() { 
            gulp.src(killMe, { read: false, base: 'dist/' })
                .pipe(clean({ force: true }));
        });
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




