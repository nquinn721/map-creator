var gulp = require('gulp'),
	less = require('gulp-less'),
	concat = require('gulp-concat'),
	clean = require('gulp-clean');


gulp.task('less', function() {
	gulp.src([
		'bower_components/bootstrap/dist/css/bootstrap.min.css',
		'bower_components/font-awesome/css/font-awesome.min.css',
		'bower_components/animate.css/animate.min.css',
		'bower_components/jquery-ui/themes/ui-darkness/jquery-ui.min.css',
		'bower_components/scrollbar/jquery.mCustomScrollbar.min.css'
	]).pipe(concat('lib.css'))
	  .pipe(gulp.dest('public/css'));
    gulp.src([
    	'public/less/variables.less',
    	'public/less/main.less', 
    	'public/less/**/*.less'])
    	.pipe(concat('m.less'))
    	.pipe(gulp.dest('public/css'))
    	.pipe(less({
	      paths: ['public/less']
	    }))
    	.pipe(concat('main.css'))
    	.pipe(gulp.dest('public/css/'));
});

gulp.task('js', function() {
	gulp.src([
		'bower_components/jquery/dist/jquery.min.js',
		'public/js/lib/jquery.mousewheel.js',
		'bower_components/angular/angular.min.js',
		'bower_components/jquery-ui/jquery-ui.min.js',
		'bower_components/angular-ui-uploader/dist/uploader.min.js',
		'public/js/lib/scrollbar/js/minified/jquery.mCustomScrollbar.min.js',
		'public/js/lib/createjs.js', 
		'public/js/lib/sb.js', 
		'public/js/global.js', 
		'public/js/controllers/*.js',
		'public/js/modes/*.js',
		'public/js/directives/*.js',
		'public/js/factories/*.js',
		'public/js/stage/*.js',
		'public/js/*.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('public/scripts'));
});

gulp.task('clean', function () {
    return gulp.src('public/css', {read: false})
        .pipe(clean());
});

gulp.task('default', function() {
	gulp.run(['clean', 'less', 'js']);
	gulp.watch(['public/less/**/*.less', 'public/js/**/*.js'], ['less', 'js']);
});