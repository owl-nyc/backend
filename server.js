var http = require('http'),
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	express = require('express'),
	app = express();

app.get('/', function (req, res) {
	res.send('hi lol');
});

app.listen(80);


var insertEntry = function (db, callback) {
	var collection = db.collection('users');

	collection.insert([ 
		{a : 1}, {a : 2}, {a: 3}
	], function (err, result) {
		assert.equal(err, null);
		assert.equal(3, result.result.n);
		assert.equal(3, result.ops.length);
		console.log('lol inserted those documents chief');
		callback(result);
	});
}

var updateEntry = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('users');
  // Update document where a is 2, set b equal to 1
  collection.update({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  }); 
}

//mongodb connection url
var url = 'mongodb://localhost:27017/myproject';
MongoClient.connect(url, function (err, db) {
	assert.equal(null, err);
	console.log('connected to mongodb server correctly');
	insertEntry(db, function () {
		updateEntry(db, function () {
			db.close();	
		});
	});
});

