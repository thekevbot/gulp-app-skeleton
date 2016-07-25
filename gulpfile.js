var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');


// Dev Tasks

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['> 5%'],
            cascade: false
        }))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
})

gulp.task('watch', ['sass', 'browserSync'], function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('default', function(callback){
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
})


// Build Tasks

gulp.task('minify', ['sass'], function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
})

gulp.task('images', function(){
    return gulp.src('app/assets/img/**/*.+(png|jpg|giv|svg)')
    .pipe(cache(imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest('dist/img'))
})

gulp.task('fonts', function() {
  return gulp.src('app/assets/fonts/**/*')
  .pipe(cache(gulp.dest('dist/fonts')))
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('build', function(callback){
    runSequence('clean:dist',
        ['sass', 'minify', 'images', 'fonts'],
        callback
    )
})
