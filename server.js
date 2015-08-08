var http = require('http'),
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert');

//mongodb connection url
var url = 'mongodb://localhost:27017/myproject';
MongoClient.connect(url, function (err, db) {
	assert.equal(null, err);
	console.log('connected to mongodb server correctly');

	db.close();
});
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');