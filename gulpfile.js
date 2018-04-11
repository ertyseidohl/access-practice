/* jshint esversion:6 */
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var ts = require('gulp-typescript');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var merge = require('merge-stream');

gulp.task(
	'clean',
	function () {
		del('./dest/**/*.html');
		del('./dest/**/*.css');
		del('./dest/**/*.js');
		del('./temp');
		return true;
	}
);

gulp.task(
	'files',
	['clean', 'ts'],
	function () {
		return gulp
			.src([
				'./src/**/*.html',
				'./src/**/*.css',
				'./src/**/*.js'
			])
			.pipe(gulp.dest('./dest/'));
	}
);

gulp.task(
	'ts',
	['clean'],
	function () {
		var tsResult = gulp.src([
			'./src/**/*.ts'
			])
			.pipe(sourcemaps.init())
			.pipe(ts({
				module: "commonjs",
				noEmitOnError: true,
				moduleResolution: 'node'
			}));

		return tsResult.js
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./temp/'));
	}
);

var watching = false;
gulp.task(
	'default',
	['clean', 'ts', 'files', 'browserify'],
	function() {
		if (!watching) {
			watching = true;
			gulp.start("watch");
		}
	}
);

gulp.task(
	'browserify',
	['clean', 'ts'],
	function() {
		var b = browserify({
			entries: './temp/main.js',
			debug: true
		});

		return b.bundle()
			.pipe(source('script.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./dest/'));
	}
);

gulp.task(
	'watch',
	function () {
		watch([
			'src/**/*',
			'index.html',
			'gulpfile.js'
		],
		function (events) {
			gulp.start('default');
		});
	}
);
