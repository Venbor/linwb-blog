const gulp = require('gulp');
const del = require('del');
const bump = require('gulp-bump');
const zip = require('gulp-zip');
const ftp = require('gulp-sftp');
const replace = require('gulp-replace');
const gulpSequence = require('gulp-sequence');

// 清除生产目录文件
gulp.task('clear', (cb) => {
  // del(['dist/**', '!dist']);
  del.sync(['./dist']);
  cb();
});

// 提升项目版本 遵循semver2.0版本规则
gulp.task('bump', (cb) => {
  gulp.src('./package.json')
    .pipe(bump()) // 当前默认 patch 模式，后面会改
    .pipe(gulp.dest('./'))
    .on('end', cb);
});

// 压缩文件
gulp.task('zip', (cb) => {
  gulp.src(['dist/**', '!dist/**/*.map'])
      .pipe(zip('linwb.zip'))
      .pipe(gulp.dest('dist'))
      .on('end', cb);
});

// 上传到服务器
gulp.task('upload', (cb) => {
  gulp.src('dist/*.zip')
      .pipe(ftp(Object.assign({
        remotePath: '/root/',
        host: '103.212.35.75',
        user: 'root',
        pass: '123456',
        port: 22,
      }, { callback: cb })));
});

// 代码替换
gulp.task('change', (cb) => {
  gulp.src(['dist/**/**/app*.js'])
    .pipe(replace('/proxy_api', '/'))
    .pipe(gulp.dest('dist'))
    .on('end', cb);
});

gulp.task('default', cb => gulpSequence('change', 'zip', 'upload', 'bump', 'clear', cb));
