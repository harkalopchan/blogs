"use strict";

var { src, dest, watch, series, parallel } = require('gulp'),
  sass = require("gulp-sass"),
  uglify = require('gulp-uglify-es').default,
  cleanCSS = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  fileinclude = require('gulp-file-include'),
  autoprefixer = require("gulp-autoprefixer"),
  maps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  browserSync = require("browser-sync").create(),
  styles,
  scripts,
  compileHtml,
  watcher;

// Compile SCSS(SASS) files
styles = () => {
  return src(["./app/scss/*.scss"])
    .pipe(maps.init())
    .pipe(
      sass
        .sync({
          outputStyle: "expanded",
          sourceComments: 'map',
          sourceMap: 'sass',
        })
        .on("error", sass.logError)
    )
    .pipe(autoprefixer())
    //.pipe(cleanCSS())
    // .pipe(
    //   rename({
    //     suffix: ".min"
    //   })
    // )
    .pipe(maps.write('./'))
    .pipe(dest("./app/css"))
    .pipe(browserSync.stream());
};

// Compile SCRIPTS files
scripts = () => {
  // jQuery first, then Popper.js, then Bootstrap JS, then other JS libraries, and last main.js
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'app/js/scripts/select2.min.js',
    'app/js/scripts/main.js',
  ])
    .pipe(maps.init())
    //.pipe(uglify())
    //.pipe(concat('app.min.js'))
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
};

// Compile HTML TEMPLATES files
compileHtml = () => {
  return src(["app/htmlPage/*.html"])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('app/'))
    .pipe(browserSync.stream());
};

// WATCH files "HTML, CSS, JS"
watcher = () => {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });

  watch(['app/scss/*.scss','app/scss/*/*.scss'], series(styles));
  watch('app/js/scripts/*.js', series(scripts));
  watch(['app/htmlPage/*.html','app/partials/*.html'], series(compileHtml));
};

exports.default = series(parallel(scripts, styles, compileHtml), watcher);