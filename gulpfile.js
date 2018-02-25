'use strict';

var gulp = require('gulp');
var glp = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

// Paths
var path = {
    pug: 'src/pug/pages/*.pug',
    watchPug: ['src/pug/**/*.pug', 'src/blocks/**/*.pug'],
    sass: ['src/sass/main.scss'],
    watchSass: ['src/sass/**/*.{scss,sass}', 'src/pug/pages/**/*.{scss,sass}', 'src/blocks/**/*.{scss,sass}'],
    staticImg: ['src/static/img/*.*'],
    js: ['src/js/**/*.js'],
    svgIcon: ['src/static/icon/**/*.svg'],
    svg: ['src/static/svg/**/*.svg']
}

// START: serve =============
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "dev",
            notify: true
        }
    });
    browserSync.watch("dev", browserSync.reload);
});
// END: serve =============

// START: Pug =============
gulp.task('pug:dev', function buildHTML() {
    return gulp.src(path.pug)
        .pipe(glp.plumber())
        .pipe(glp.debug())
        .pipe(glp.pug({
            pretty: true
        }))
        .on("error", glp.notify.onError({
            message: "Error: <%= error.message %>",
            title: "Pug"
        }))
        .pipe(glp.debug())
        .pipe(gulp.dest('dev/'))
        .on('end', browserSync.reload);
});

gulp.task('pug:build', function buildHTML() {
    return gulp.src(path.pug)
        .pipe(glp.debug())
        .pipe(glp.pug({
            pretty: true
        }))
        .pipe(glp.debug())
        .pipe(gulp.dest('app/'));
});
// END: Pug =============

// START: sass =============
gulp.task('sass:dev', function () {
    return gulp.src(path.sass)
        .pipe(glp.plumber())
        .pipe(glp.sourcemaps.init())
        .pipe(glp.debug())
        .pipe(glp.sass())
        .on("error", glp.notify.onError({
            message: "Error: <%= error.message %>",
            title: "Style"
        }))
        .pipe(glp.autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(glp.csso())
        .pipe(glp.sourcemaps.write())
        .pipe(glp.debug())
        .pipe(gulp.dest('dev/static/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('sass:build', function () {
    return gulp.src(path.sass)
        .pipe(glp.plumber())
        .pipe(glp.debug())
        .pipe(glp.sass())
        .on("error", glp.notify.onError({
            message: "Error: <%= error.message %>",
            title: "Style"
        }))
        .pipe(glp.autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(glp.csso())
        .pipe(glp.debug())
        .pipe(gulp.dest('app/static/css'));
});
// END: sass =============

// START: static =============
gulp.task('static:dev', function() {
    return gulp.src(path.staticImg)
        .pipe(glp.debug())
        .pipe(glp.plumber())
        .pipe(gulp.dest('dev/static/img'));
});
// END: static =============

// START: Scripts =============
gulp.task('scripts:dev', function() {
    // './node_modules/svg4everybody/dist/svg4everybody.js' './node_modules/svgxuse/svgxuse.min.js'
    return gulp.src(['./node_modules/svg4everybody/dist/svg4everybody.js','./node_modules/jquery/dist/jquery.min.js', './node_modules/slick-carousel/slick/slick.min.js'])
        .pipe(glp.plumber())
        .pipe(glp.debug())
        .pipe(glp.concat('libs.min.js',{newLine: ';'}))
        .on("error", glp.notify.onError({
            message: "Error: <%= error.message %>",
            title: "Style"
        }))
        .pipe(glp.debug())
        .pipe(gulp.dest('dev/static/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('scripts:dev:mainJs', function() {
    return gulp.src(path.js)
        .pipe(glp.plumber())
        .pipe(glp.debug())
        .pipe(gulp.dest('dev/static/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('scripts:build', function() {
    return gulp.src(['./node_modules/svg4everybody/dist/svg4everybody.js', './node_modules/jquery/dist/jquery.min.js', './node_modules/slick-carousel/slick/slick.min.js'])
        .pipe(glp.plumber())
        .pipe(glp.debug())
        .pipe(glp.concat('libs.min.js',{newLine: ';'}))
        .on("error", glp.notify.onError({
            message: "Error: <%= error.message %>",
            title: "Style"
        }))
        .pipe(glp.debug())
        .pipe(gulp.dest('app/static/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('scripts:build:mainJs', function() {
    return gulp.src(path.js)
        .pipe(glp.plumber())
        .pipe(glp.debug())
        .pipe(gulp.dest('app/static/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
// END: Scripts =============

// START: img =============
gulp.task('image:build', function() {
    return gulp.src(path.staticImg)
        .pipe(glp.imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 10
        }))
        .pipe(gulp.dest('app/static/img'));
});
// END: img =============

// START: svg icon =============
gulp.task('svg:icon:dev', function() {
    return gulp.src(path.svgIcon)
        .pipe(glp.plumber())
        // minify svg
        .pipe(glp.svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(glp.cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(glp.replace('&gt;', '>'))
        // build svg sprite
        .pipe(glp.svgSprite({
            mode: {
                symbol: {
                    sprite: "../icon.svg",
                    render: {
                        template: 'src/sass/icon/icon.scss'
                    }
                }
            }
        }))
        .pipe(gulp.dest('dev/static/icon/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('svg:icon:build', function() {
    return gulp.src(path.svgIcon)
        .pipe(glp.plumber())
        // minify svg
        .pipe(glp.svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(glp.cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(glp.replace('&gt;', '>'))
        // build svg sprite
        .pipe(glp.svgSprite({
            mode: {
                symbol: {
                    sprite: "../icon.svg",
                    render: {
                        template: 'src/sass/icon/icon.scss'
                    }
                }
            }
        }))
        .pipe(gulp.dest('app/static/icon/'));
});
// END: svg icon =============

// START: svg =============
gulp.task('svg:svg:dev', function() {
    return gulp.src(path.svg)
        .pipe(glp.plumber())
        // minify svg
        .pipe(glp.svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(glp.cheerio({
            run: function ($) {
                // $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(glp.replace('&gt;', '>'))
        // build svg sprite
        .pipe(glp.svgSprite({
            mode: {
                symbol: {
                    sprite: "../color.svg",
                    render: {
                        template: 'src/sass/icon/color.scss'
                    }
                }
            }
        }))
        .pipe(gulp.dest('dev/static/svg/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('svg:icon:build', function() {
    return gulp.src(path.svg)
        .pipe(glp.plumber())
        // minify svg
        .pipe(glp.svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(glp.cheerio({
            run: function ($) {
                // $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(glp.replace('&gt;', '>'))
        // build svg sprite
        .pipe(glp.svgSprite({
            mode: {
                symbol: {
                    sprite: "../color.svg",
                    render: {
                        template: 'src/sass/svg/color.scss'
                    }
                }
            }
        }))
        .pipe(gulp.dest('app/static/svg/'));
});
// END: svg =============

// START: del =============
var del = require('del');
gulp.task('clean', function() {
    return del(['dev', 'app']);
});
// END: del =============


// START: watch =============
gulp.task('watch', function() {
    gulp.watch(path.watchPug, ['pug:dev']),
    gulp.watch(path.watchSass, ['sass:dev']),
    gulp.watch(path.staticImg, ['static:dev']),
    gulp.watch(path.js, ['static:dev', 'scripts:dev:mainJs']),
    gulp.watch(path.svg, ['svg:icon:dev']),
    gulp.watch(path.svg, ['svg:svg:dev'])
});
// END: watch =============

// START: =============
gulp.task('dev', ['pug:dev','sass:dev', 'static:dev', 'scripts:dev', 'scripts:dev', 'scripts:dev:mainJs', 'svg:icon:dev', 'svg:svg:dev', 'watch', 'serve']);

gulp.task('build', ['pug:build', 'sass:build', 'scripts:build', 'scripts:build:mainJs', 'image:build', 'svg:icon:build']);
// END: =============



