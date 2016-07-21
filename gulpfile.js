var config = {
    srcFolder: 'src',
    srcFile: 'photo-resize.js',
//    srcFile: 'Foo.js',
    dstFolder: 'public/scripts',
    dstFile: 'photo-resize.js'
//    dstFile: 'Foo.js',
};

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();
var $ = require('gulp-load-plugins')();

var b = browserify({
    entries: config.srcFolder+'/'+config.srcFile,
    cache: {},
    packageCache: {},
    plugin: [watchify]
});

b.on('update', rebundle);
b.on('log', $.util.log);

function rebundle() {
    return b
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe( source( config.dstFile ))
        .pipe( gulp.dest( config.dstFolder ) )
        .on('end', function() {
            browserSync.reload();
        });
}

gulp.task('bundle', function() {
    return rebundle();
});

gulp.task('watch', ['bundle'], function() {
    browserSync.init({
        logPrefix: 'BrowserSync',
        server: ['public']
    });

    gulp.watch('public/*.html', ['bundle', browserSync.reload]);
});
