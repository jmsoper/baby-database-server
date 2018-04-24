var http = require('http');
var url = require('url');
var querystring = require('querystring');


var database = {};

var portInUse = 8080;

var server = http.createServer(function(req, res) {
  var page = url.parse(req.url).pathname;
  var status = 200;
  var params = querystring.parse(url.parse(req.url).query);
  var content = "<p>To read from the database, append <strong>?key=<em>desiredKey</em></strong> to the URL.</p>";
  content += "<p>To write to the database, append <strong>?<em>yourKey</em>=<em>yourValue</em></strong> to the URL.</p>";

  if (page === '/get'){
    if (params && params.key){
      var key = params.key;
      if (database[key]){
        content += ("\n " + String(key) + ": " + database[key]);
      } else {
        content += ("\n The key '" + String(key) + "' does not exist in the current database.");
      }
    }
  } else if (page === '/set'){
    if (params){
      for (key in params){
        database[key] = params[key];
        content += ("<p>The value '" + params[key] + "' has been stored to the database at '" + key + "'</p>");
      }
    }
  } else {
    status = 404;
    content = "You're lost! Try going <a href='\/get'>here</a>.";
  }
  res.writeHead(status, {'Content-type': 'text/html'});
  res.write('<!DOCTYPE html>'+
    '<html>'+
    ' <head>'+
    ' <meta charset="utf-8" />'+
    ' <title>Database Server Demo</title>'+
    ' </head>'+
    ' <body>'+
    ' ' + content +
    ' </body>' +
    '</html>');
  res.end();
});

server.listen(portInUse);
console.log("Server running on port " + String(portInUse));
