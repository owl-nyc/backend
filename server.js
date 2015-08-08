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


// create server
http.createServer(function (req, res) {
  console.log('%d request received\n', process.pid);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(80);

console.log('Server listening on port 80\n');


