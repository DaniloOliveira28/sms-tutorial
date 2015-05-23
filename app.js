/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , socketio = require('socket.io');

var app = express()
  , server = http.createServer(app)
  , io = socketio.listen(server);

var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


server.listen(appEnv.port, appEnv.bind, function() {

  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});



io.configure('production', function(){
  io.enable('browser client etag');
  io.set('log level', 1);
});

io.configure('development', function(){
  io.set('log level', 1);
});

io.sockets.on('connection', function(socket) {
    socket.on('event', function(event) {
        socket.join(event);
    });
});

var routes = require('./routes')(io);

app.get('/', routes.index);
app.get('/events/:shortname', routes.getEvent);
app.post('/vote/sms', routes.voteSMS);
