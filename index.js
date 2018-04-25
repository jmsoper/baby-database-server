var http = require('http');
var url = require('url');
var querystring = require('querystring');

class DataStore {
  constructor () {
    this.database = {};
  }
  getItem({ key, response }){
    if (!this.database[key]){
      response.status = 404;
      response.content = 'Key "' + key + '" not found in database'; 
      return response;
    }
    response.status = 200;
    response.content += '<p>' + key + ': ' + this.database[key];
    return response;
  }
  setItem({ key, value, response }){
    this.database[key] = value;
    response.status = 200;
    response.content = '<p>Successful write to database</p><p> The value ' + value + ' has been written to the key "' + key + '"';
    return response;
  }
}

const PORT = 8080;

const composeHTML = function(content) {
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

var requestProcessor = function(req, res, datastore) {
  var page = url.parse(req.url).pathname;
  var params = querystring.parse(url.parse(req.url).query);
  var starterContent = "<p>To read from the database, append <strong>?key=<em>desiredKey</em></strong> to the URL.</p><p>To write to the database, append <strong>?<em>yourKey</em>=<em>yourValue</em></strong> to the URL.</p>";
  var responseData = { status: 200, content: starterContent }

  if (page === '/get'){
    if (params && params.key){
      var key = params.key;
      datastore.getItem({ key: params.key, response: responseData });
    }
  } else if (page === '/set'){
    if (params){
      for (key in params){
        datastore.setItem({ key: key, value: params[key], response: responseData });
      }
    }
  } else {
    responseData.status = 404;
    responseData.content = "You're lost! Try going <a href='\/get'>here</a>.";
  }
  res.writeHead(responseData.status, {'Content-type': 'text/html'});
  res.write(composeHTML(responseData.content));
  res.end();
}

var datastore = new DataStore();

var server = http.createServer((req, res) => requestProcessor(req, res, datastore));
server.listen(PORT);
console.log("Server running on port " + String(PORT));
