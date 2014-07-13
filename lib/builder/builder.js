var gulp = require('gulp');
var template = require('gulp-template');

var options = null;

module.exports = function (opt) {
    _setupTemplateOptions(opt);
    gulp.run('pre-commit');
};

function _setupTemplateOptions() {
    options = opt;
}

gulp.task('pre-commit', function () {
    console.log(process.cwd());
    console.log(options);
    gulp.src('lib/hooks/pre-commit/*')
        .pipe(template({
            name: 'Sindre'
        }))
        .pipe(gulp.dest('dist'));
});
