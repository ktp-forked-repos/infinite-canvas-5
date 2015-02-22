# Load Dependencies
express           = require 'express'
# mongoStore      = require('connect-mongo')(express)
http              = require 'http'
path              = require 'path'
passport          = require 'passport'
mongoose          = require 'mongoose'
config            = require "./config" 
# toobusy           = require 'toobusy'
logger            = require('morgan')
session           = require('express-session')
bodyParser        = require('body-parser')
cookieParser      = require('cookie-parser')

app = express()
app.set('port', process.env.PORT || 5000);

socketIO = http.createServer()
io = require('socket.io')(socketIO)

app.db = mongoose.createConnection(config.mongodb.uri)
app.db.on 'error', console.error.bind(console, 'mongoose connection error: ')
app.db.once 'open', ->
  console.log "mongodb connected" , config.mongodb.uri

require('./models')(app, mongoose)

#setup the session store
# app.sessionStore = new mongoStore({ url: config.mongodb.uri })

### 
 Use PREEMPTIVE LIMITING to avoid application failure dur to exceeded request capacity by orders of magnitude
###
# app.use (req, res, next) ->
#   if toobusy()
#     res.send(503, "I'm busy right now, sorry.")
#   else 
#     next()

# Configure app middleware
app.use logger('dev')
app.use express.static("#{__dirname}/public")
app.use bodyParser.urlencoded({ extended: true })
# allow cors
app.all (req, res, next) ->
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
# app.use express.session
#   secret: config.cryptoKey
#   store: app.sessionStore
# app.use passport.initialize()
# app.use passport.session()

  # global locals
app.locals.cacheBreaker = 'br34k-01'


# Start Server
app.listen app.get('port'), ->
  console.log "server running on port #{app.get('port')}"

# config express in production environment
app.get '/', (req, res, next) ->
  res.sendfile 'index.html', root: './public'

routes        = require('./routes')(app)

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
