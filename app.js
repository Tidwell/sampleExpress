require.paths.unshift('/usr/local/lib/node/.npm/xml2js/active/package')
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var log = require('logging');
var mongoose = require('mongoose');
var request = require('request');
var xml2js = require('xml2js');



var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/testdb');
//declare the model 
var userSchema = new Schema({
 name: String,
 password: String
})
mongoose.model('User', userSchema);
//connect and grab the model
var User = mongoose.model('User'); //global

/*
CODE TO CREATE A NEW OBJECT AND SAVE IN MONGO
var newUser = new User();
newUser.name = 'Bob';
newUser.password = 'qwe123';
newUser.save();  
*/


var app = module.exports = express.createServer();


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register('.html', require('jqtpl'))
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  //find all users
  User.find({}, function(err, doc){
    var url = 'http://devutil.dev.marthastewart.com:8080/vcservice/getMsloContent?ID=ce4c40ee0c90f010VgnVCM1000003d370a0a____';
    request({uri:url}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        parser.parseString(body);
      }
      else if (error) {
        log('Error when fetching from RCT, URL: '+url+'\n'+'Error: '+error);
      }
    });  
    parser.on('end', function(result) { 
      //output the first one found's user/pass
      res.render('index', {
        locals: {
          hdr: 'Express',
          stuff: doc[0].doc,
          result: result
        },
        layout: false,
        debug: true
      });
      log(result);
    });
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
