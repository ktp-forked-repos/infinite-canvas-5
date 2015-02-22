# Load Dependencies
express       = require 'express'
# mongoStore    = require('connect-mongo')(express)
http          = require 'http'
path          = require 'path'
# passport      = require 'passport'
mongoose      = require 'mongoose'
config        = require './config'
# toobusy       = require 'toobusy'

app = express.createServer()
io = require('socket.io')(app)



# Configure Models
require('./models')(app, mongoose)

#setup the session store
# app.sessionStore = new mongoStore({ url: config.mongodb.uri })

# Configure app
app.configure ->
  ### 
   Use PREEMPTIVE LIMITING to avoid application failure dur to exceeded request capacity by orders of magnitude
  ###

  # app.use (req, res, next) ->
  #   if toobusy()
  #     res.send(503, "I'm busy right now, sorry.")
  #   else 
  #     next()
  
  # middleware
  app.use express.favicon(__dirname + '/public/favicon.ico')
  app.use express.logger('dev')
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser()
  app.use express.static("#{__dirname}/public")
  # allow cors
  app.use (req, res, next) ->
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  # app.use express.session
  #   secret: config.cryptoKey
  #   store: app.sessionStore
  # app.use passport.initialize()
  # app.use passport.session()
  app.use app.router
  routes        = require('./routes')(app)

  # global locals
  app.locals.cacheBreaker = 'br34k-01'

# config express in dev environment
app.configure 'development', ->
  # Create server and DB connections
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
  app.db = mongoose.connect(config.mongodb.uri)
  
# config express in production environment
app.configure 'production', ->
  # Create server and DB connections
  app.db = mongoose.connect('mongodb://' + process.env.MONGOLAB_URI)

app.db.on 'error', console.error.bind(console, 'mongoose connection error: ')
app.db.once 'open', ->
  console.log "mongodb connected"

# Start Server
app.listen 9000, ->
  console.log "server running on port 9000"

online = 0
# listen to socket connections

# io.set 'origins', '*'
canvasPool = io.of('/LiveCanvas').on 'connection', (socket) ->
  online++
  console.log 'online', online
  
  socket.on 'spot.update', (data) =>
    console.log 'spot.update from',
      x: data.hPos
      y: data.vPos
      data: data.drawingDataUrl.length
    socket.broadcast.emit 'spot.updated', data

    # DrawingModel.saveDrawing

  socket.on 'spot.lock', (data) =>
    console.log 'spot.lock from', data
    socket.broadcast.emit 'spot.reserved', data

  socket.on 'spot.unlock', (data) =>
    console.log 'spot.unlock from', data
    socket.broadcast.emit 'spot.unreserved', data

  socket.emit 'hello', onlineUsers: online

  socket.on 'disconnect', (data) ->
    canvasPool.emit 'user:left', data
    online--
