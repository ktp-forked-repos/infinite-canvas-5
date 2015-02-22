gulp            = require 'gulp'
coffee          = require 'gulp-coffee'
concat          = require 'gulp-concat'
coffeeify       = require 'coffeeify'
browserify      = require 'gulp-browserify'
plumber         = require 'gulp-plumber'
templateCache   = require 'gulp-angular-templatecache'
notify          = require 'gulp-notify'
gutil           = require 'gulp-util'
ngAnnotate      = require 'gulp-ng-annotate'
uglify          = require 'gulp-uglifyjs'
sourcemaps      = require 'gulp-sourcemaps'
less            = require 'gulp-less' 

# Modules required for the livereload - express, connect, tiny-lr, etc
minifyHTML      = require 'gulp-minify-html'
embedlr         = require('gulp-embedlr')
refresh         = require('gulp-livereload')
lrserver        = require('tiny-lr')()
express         = require('express')
livereload      = require('connect-livereload')
livereloadport  = 35729
serverport      = 5000

# Set up an express server 
server = express.createServer()
# Add live reload
server.use livereload({port: livereloadport}) 
# Use our 'public' folder as rootfolder
server.use express.static('public/') 
server.use("/css", express.static(__dirname + "/public/css/"));
server.use("/js", express.static(__dirname + "/public/js"));

# watch for the index.html changes and reload server
gulp.task 'index', ->
  gulp.src './src/index.html'
    .pipe minifyHTML()
    .pipe gulp.dest './public/'
    .pipe refresh(lrserver)

# connect task - new konnekt
gulp.task 'server', ->
  # Start webserver
  server.listen(serverport)
  # Start live reload
  lrserver.listen(livereloadport)

# compile coffee files and annotate for use with strictDI
gulp.task 'coffee', -> 
  gulp.src('./src/app.coffee', { read: false })
    .pipe(plumber())
    .pipe browserify({ transform: ['coffeeify'], debug: true, extensions: [ '.coffee' ] })
    .on 'error', gutil.log
    .pipe ngAnnotate()
    .pipe concat 'client.build.js'
    .pipe gulp.dest './public/js/'
    .pipe notify {'title': 'Quickstart Service', message: 'Done Coffee build'}
    .pipe refresh(lrserver)

# bundle compile and minify coffee files
gulp.task 'coffee-production', -> 
  gulp.src('./src/app.coffee', { read: false })
    .pipe(plumber())
    .pipe browserify({ transform: ['coffeeify'], debug: true, extensions: [ '.coffee' ] })
    .on 'error', gutil.log
    .pipe ngAnnotate()
    .pipe uglify( 'client.build.js', { outSourceMap: true })
    .pipe gulp.dest './public/js/'
    .pipe notify {'title': 'Quickstart Service', message: 'Done Coffee production build'}

# bundle app template files 
gulp.task 'templates', ->
  gulp.src './src/**/*.html'
    .pipe templateCache('templates.build.min.js', standalone: true)
    .pipe uglify()
    .pipe gulp.dest './public/js'
    .pipe notify {'title': 'Quickstart Service', message: 'Templates Generated Successfully'}
    .pipe refresh lrserver

# bundle app styles
gulp.task 'less', ->
  gulp.src('./src/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe concat 'client.css'
    .pipe gulp.dest('./public/css')
    .pipe notify {'title': 'Quickstart Service', message: 'Done Styles build'}

# bundle all required vendor scripts
gulp.task 'bower_scripts', ->
  gulp.src([
    './bower_components/jquery/dist/jquery.js'
    './bower_components/lodash/lodash.min.js'
    './bower_components/angular/angular.js'
    './bower_components/angular-animate/angular-animate.js'
    './bower_components/angular-strap/dist/angular-strap.js'
    './bower_components/angular-strap/dist/angular-strap.tpl.js'
    './bower_components/ng-resource/dist/ng-resource.js'
    './bower_components/angular-mocks/angular-mocks.js'
    './bower_components/angular-ui-router/release/angular-ui-router.js'
    './bower_components/angular-lodash-module/angular-lodash-module.js'
    './bower_components/angular-socket-io/socket.js'
    './bower_components/socket.io-client/socket.io.js'
    './bower_components/angular-strap/dist/angular-strap.js'
  ]).pipe concat 'vendor.build.js'
  .pipe gulp.dest './public/js/'
  .pipe notify {'title': 'Quickstart Service', message: 'Vendor Scripts Generated Successfully'}

gulp.task 'bower_styles', ->
  gulp.src([
    './bower_components/bootstrap/dist/css/bootstrap.css'
    './bower_components/angular-motion/dist/angular-motion.css'
  ]).pipe concat 'vendor.css'
  .pipe gulp.dest './public/css/'
  .pipe notify {'title': 'Quickstart Service', message: 'Vendor Styles Generated Successfully'}

# watch source files and rebuild when changed
gulp.task 'watch', ->
  gulp.watch 'src/**/*.coffee', [ 'coffee' ] 
  gulp.watch 'src/index.html', [ 'index' ]
  gulp.watch 'src/**/*.html', [ 'templates' ]
  gulp.watch 'src/**/*.less', [ 'less' ]

# development task
gulp.task 'default', [
  'server'
  'watch'
  'index'
  'templates'
  'bower_styles'
  'less'
  'bower_scripts'
  'coffee'
]

# production task
gulp.task 'production', [
  'watch'
  'templates'
  'bower_styles'
  'less'
  'bower_scripts'
  'coffee-production'
]

