
const gulp            = require('gulp');
const sass            = require('gulp-sass');
const pug             = require('gulp-pug');
const plumber         = require('gulp-plumber');
const browser         = require('browser-sync');
const pleeease        = require('gulp-pleeease');
const webpack         = require('webpack');
const webpackStream   = require('webpack-stream');
const data            = require('gulp-data');

const sasssrc         = './src/scss/**/*.scss';
const pugsrc          = './src/pug/**/*.pug';
const datasrc         = './src/_data/meta.json';
const notpugsrc       = '!./src/pug/_**/*.pug';
const jssrc           = './src/js/*.js'
const bundlesrc       = './webroot/js/*.js'
const bundledir       = './webroot/js/'
const htmlsrc         = './webroot/';
const csssrc          = './webroot/css/';


gulp.task('pug', function () {
  gulp.src([pugsrc,notpugsrc])
      .pipe(plumber())
      .pipe(data(function(file) {
        // metaのjsonファイルを取得
        let metaData = require(datasrc);
        // 対象のファイルパスを取得して、\を/に置換
        let filePath = file.path.split('\\').join('/');
        // 必要なファイルパス部分のみ取得
        let fileName = filePath.split('src/pug/')[1].replace('.pug', '.html');
        // jsonファイルから対象ページの情報を取得して返す
        return metaData[fileName];
    }))
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest(htmlsrc))
      .pipe(browser.reload({stream: true}));
});

gulp.task('sass', function () {
    gulp.src(sasssrc)
        .pipe(plumber())
        .pipe(sass({
          outputStyle: 'expanded',
        }))
        .pipe(pleeease({
            minifier: false,
            autoprefixer: {"browsers": ["last 4 versions", "ie 10", "Android 2.3"]}
        }))
        .pipe(gulp.dest(csssrc))
        .pipe(browser.reload({stream: true}));
});

// webpackの設定ファイルの読み込み
const webpackConfig = require('./webpack.config');

gulp.task('webpack',function(){
  return webpackStream(webpackConfig, webpack)
      .pipe(gulp.dest(bundledir));
});

gulp.task('server', function () {
  browser({
    server: {
      baseDir: "./webroot/"
    }
  });
  gulp.watch(htmlsrc , ['serverReload']);
  gulp.watch(csssrc , ['serverReload']);
  gulp.watch(bundlesrc , ['serverReload']);
});

gulp.task('watch' , function(){
    gulp.watch(sasssrc, ['sass']);
    gulp.watch(pugsrc, ['pug']);
    gulp.watch(jssrc, ['webpack']);
});

gulp.task('serverReload', function() {
    browser.reload();
});

gulp.task('default',['watch','webpack','pug','sass','server']);
