/**
 * Module dependencies.
 */




/*jshint node:true*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as it's web server
// for more info, see: http://expressjs.com
express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.urlencoded());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/vote/sms', routes.voteSMS);


// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

