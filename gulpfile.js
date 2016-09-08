var gulp = require('gulp'),
    sass = require('gulp-sass'),
    php = require('gulp-connect-php'),
    browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    runSequence = require('run-sequence'),
    autoprefixer = require('gulp-autoprefixer');


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

gulp.task('php', function() {
    php.server({base: 'app', port: 8010, keepalive: true});
})

gulp.task('browserSync',['php'], function(){
    browserSync.init({
        proxy: '127.0.0.1:8010',
        port: 8080,
        open: true,
        notify: false
    });
})

gulp.task('watch', ['sass', 'browserSync'], function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/*.php', browserSync.reload);
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
