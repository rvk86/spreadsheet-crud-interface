// Include Gulp
var gulp = require('gulp');

// Include plugins
var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});

// Define default destination folder
var dest = 'src/assets/';

gulp.task('js', function() {

	gulp.src(plugins.mainBowerFiles())
		.pipe(plugins.filter(['**/*.js']))
		.pipe(plugins.concat('js.html'))
		.pipe(plugins.uglify())
		.pipe(plugins.insert.wrap('<script>', '</script>'))
		.pipe(gulp.dest(dest));

});

// TODO: Not working yet
// gulp.task('css', function() {
//
// 	gulp.src(plugins.mainBowerFiles())
// 		.pipe(plugins.filter(['**/*.less']))
// 		.pipe(plugins.less())
// 		.pipe(plugins.concat('less.css'))
// 		.pipe(gulp.src(plugins.mainBowerFiles()))
// 		.pipe(plugins.filter(['**/*.css']))
// 		.pipe(plugins.cleanCss())
// 		.pipe(plugins.concat('css.html'))
// 		.pipe(plugins.insert.wrap('<script>', '</script>'))
// 		.pipe(gulp.dest(dest));
//
// });


gulp.task('default', ['js']);
