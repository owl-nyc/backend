var http = require('http'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    express = require('express'),
    app = express();

app.get('/', function (req, res) {
    res.send('hi lol');
});

app.get('/set_state', function (req, res) {
    //mongodb connection url
    var url = 'mongodb://localhost:27017/myproject';
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        setUser(db, req.query, function () {
            db.close();
            res.send('success lols');            
        });
    }); 
});


app.get('/get_state', function (req, res) {
    //mongodb connection url
    var url = 'mongodb://localhost:27017/myproject';
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        getUser(db, req.query, res, function () {
            db.close();
        });
    });
});


app.get('/delete_state', function (req, res) {
    var url = 'mongodb://localhost:27017/myproject';
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        deleteUser(db, req.query, function () {
            db.close();
            res.send('delete_state: success lols');
        });
    });
});
app.listen(3000);

//setUser: sets user based on query
var setUser = function (db, query, callback) {
    var collection = db.collection('users');
    var user = query['name'];
    var results = collection.find({'name': user}).toArray(function(err, users) {

    var data = query;

    data['last_updated'] = Date.now();
    data['battery level'] = -1;

    if (users.length != 0) {
        console.log('user exists');
        console.log(users[0]['name']);


        data['d_lat'] = data['lat'] - users[0]['lat'];
        data['d_lon'] = data['lon'] - users[0]['lon'];

        collection.update( { name : users[0]['name']}, query, callback);


    } else {
        console.log('user does not exits');

        data['orig_lat'] = data['lat'];
        data['orig_lon'] = data['lon'];
        data['d_lat'] = 0;
        data['d_lon'] = 0;

        collection.insert(query, callback);


    }


    });

}

//getUser: gets user data on request
var getUser = function(db, query, res, callback) {
    var collection = db.collection('users');
    collection.find({'name' : query['name']}).toArray(function(err, users) {
        if (users.length != 0) {
            console.log('found user')
            console.log(JSON.stringify(users[0]));
            res.send(JSON.stringify(users[0]));
        } else {
            console.log('did not find user');
            console.log({});
            res.send({});
        }
        callback();
    })
}

var deleteUser = function(db, query, callback) {
    var collection = db.collection('users');
    collection.deleteMany(
        {'name' : query['name']},
        function (err, results) {
            console.log(results);
            callback();
        }
    );
}

//website lul
app.use(express.static('public'));
app.get('/l33tH4XX0r', function (req, res) {
    res.sendFile('public/index.html', {'root': __dirname});
});
