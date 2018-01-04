var gulp = require('gulp'),
  del = require('del'),
  ts = require('gulp-typescript'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat');

gulp.task('build', ['build:main'], function () {
  gulp.src(["./node_modules/store/dist/store.modern.min.js", "./dist/index.js"])
    .pipe(concat('index.store.min.js', { newLine: '\r\n;' }))
    .pipe(uglify())
    .pipe(gulp.dest("./dist"));

  gulp.src(["./node_modules/store/dist/store.modern.js", "./dist/index.js"])
    .pipe(concat('index.store.js', { newLine: '\r\n;' }))
    .pipe(gulp.dest("./dist"));

  return gulp.src(["./dist/index.js"])
    .pipe(uglify())
    .pipe(rename('index.min.js'))
    .pipe(gulp.dest("./dist"));
})

gulp.task('build:main', ['typescript'], function () {
  return gulp.src(["./build/**/*.js"])
    .pipe(concat('index.js', { newLine: '\r\n;' }))
    .pipe(gulp.dest("./dist"))
})

gulp.task('typescript', ['clean'], function () {
  return gulp.src(["./src/**/*.ts"])
    .pipe(ts({
      declaration: false,
      removeComments: true,
      target: "ES5",
      module: "es2015",
      noImplicitAny: false,
    }))
    .pipe(gulp.dest("./build"));
})

gulp.task('clean', function () {
  return del(['./build', './dist'])
})
