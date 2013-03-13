var http = require('http'),
    path = require('path');

var express = require('express'),
    flexigin = require('flexigin-node');

var app = express();
app.use(flexigin({
  baseUrl: '/test/components',
  basePath: path.join(__dirname, '/test/components')
}));
app.use(express.static(__dirname + '/lib'));
app.use(express.static(__dirname + '/test'));

http.createServer(app).listen(3000);