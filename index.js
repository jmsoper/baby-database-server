var http = require('http');
var url = require('url');
var querystring = require('querystring');


var database = {};

var PORT = 8080;

var composeHTML = function(content) {
  return ('<!DOCTYPE html>'+
    '<html>'+
    ' <head>'+
    ' <meta charset="utf-8" />'+
    ' <title>Database Server Demo</title>'+
    ' </head>'+
    ' <body>'+
    ' ' + content +
    ' </body>' +
    '</html>');
}

var server = http.createServer(function(req, res) {
  var page = url.parse(req.url).pathname;
  var params = querystring.parse(url.parse(req.url).query);
  var starterContent = "<p>To read from the database, append <strong>?key=<em>desiredKey</em></strong> to the URL.</p><p>To write to the database, append <strong>?<em>yourKey</em>=<em>yourValue</em></strong> to the URL.</p>";
  var responseData = { status: 200, content: starterContent }

  if (page === '/get'){
    if (params && params.key){
      var key = params.key;
      if (database[key]){
        responseData.content += ("\n " + String(key) + ": " + database[key]);
      } else {
        responseData.status = 404;
        responseData.content += ("\n The key '" + String(key) + "' does not exist in the current database.");
      }
    }
  } else if (page === '/set'){
    if (params){
      for (key in params){
        database[key] = params[key];
        responseData.content += ("<p>The value '" + params[key] + "' has been stored to the database at '" + key + "'</p>");
      }
    }
  } else {
    responseData.status = 404;
    responseData.content = "You're lost! Try going <a href='\/get'>here</a>.";
  }
  res.writeHead(responseData.status, {'Content-type': 'text/html'});
  res.write(composeHTML(responseData.content));
  res.end();
});

server.listen(PORT);
console.log("Server running on port " + String(PORT));
