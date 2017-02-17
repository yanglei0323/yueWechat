var gulp = require('gulp'),
    jshint = require('gulp-jshint'), // 语法检查
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'), //合并文件
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    rename = require('gulp-rename'),
    del = require('del'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    runSequence = require('run-sequence')
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');

gulp.task('cleanJs', function () {
    del(['build/js']);
});
gulp.task('cleanCss', function () {
    del(['build/css']);
});
// 压缩js文件
gulp.task('buildJs', function () {
	return gulp.src(['src/js/index.js', 'src/js/factory.js', 'src/js/directive.js', 'src/js/*.js'])
	    .pipe(jshint())
	    .pipe(jshint.reporter('default'))
        .pipe(plumber())
	    .pipe(uglify())
	    .pipe(concat('app.min.js'))
        .pipe(rev())
	    .pipe(gulp.dest('build/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});

// 编译less文件并压缩
gulp.task('buildLess', function () {
    return gulp.src('src/less/*.less')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error %>')}))
        .pipe(less())
        .pipe(minifycss())
        .pipe(concat('app.min.css'))
        .pipe(rev())
        .pipe(gulp.dest('build/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});

gulp.task('rev', function () {
    return gulp.src(['rev/**/*.json', 'src/html/*.html'])
        .pipe(revCollector())
        .pipe(minifyHtml())
        .pipe(gulp.dest('build/html'))
})

gulp.task('watchLess', function () {
    gulp.watch('src/less/*.less', ['buildLess']);
});

// 开发运行监听
gulp.task('watch', function () {
    gulp.watch('src/less/*.less', function () {
        runSequence('buildLess', 'rev');
    });
    gulp.watch('src/html/*.html', ['rev']);
    gulp.watch('src/js/*.js', function () {
        runSequence('buildJs', 'rev');
    });
});

gulp.task('build', function () {
    runSequence('cleanCss', 'cleanJs', 'buildLess', 'buildJs', 'rev');
});