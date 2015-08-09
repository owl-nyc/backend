var util = require('./util.js');

var GLOBAL_BATTERY_MIN = 0.1;
var GLOBAL_RADIUS_MAX = 0.001;
var GLOBAL_SPEED_MAX = 0.0001;
var GLOBAL_MINUTES_MAX = 3;


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
        setUser(db, req.query, res, function () {
            db.close();
            console.log('success lols');            
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

app.get('/add_watch', function(req, res) {
    var url = 'mongodb://localhost:27017/myproject';
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);

        // function
        addWatch(db, req.query, (function() {
            db.close();
            res.send('success');

        }));
    })
});

app.get('/delete_watch', function(req, res) {
    var url = 'mongodb://localhost:27017/myproject';
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);

        // function
        deleteWatch(db, req.query, (function() {
            db.close();
            res.send('removed');
        }));

    })
});

app.get('/pay', function(req, res) {
    res.sendFile('public/pay.html', {'root': __dirname});

});
app.listen(3000);


var addWatch = function (db, query, callback) {
    var collection = db.collection('users');

    var user = query['name'];
    var results = collection.find({'name': user}).toArray(function(err, users) {

        var data = users[0];
        console.log(data);

        if (data['watchers'] && data['watchers'].indexOf(query['from']) == -1)
            data['watchers'].push(query['from']);


        collection.update( {name: users[0]['name']}, data, callback);

    });
}

var deleteWatch = function (db, query, callback) {
    var collection = db.collection('users');

    var user = query['name'];
    var results = collection.find({'name': user}).toArray(function(err, users) {

        var watchers = users[0]['watchers'];

        var index = watchers.indexOf(query['from']);

        if (index > -1) {
            watchers.splice(index, 1);
        }

        var data = users[0];
        data['watchers'] = watchers;

        collection.update( {name: users[0]['name']}, data, callback);
    })
}


//setUser: sets user based on query
var setUser = function (db, query, res, callback) {
    var collection = db.collection('users');
    var user = query['name'];
    var results = collection.find({'name': user}).toArray(function(err, users) {



        if (users.length != 0) {
            console.log('user exists');
            console.log(users[0]['name']);

            var data = users[0];

            data['last_updated'] = Date.now();

            // kinda funky

            if (query.hasOwnProperty('drunk')) {
                data['alerts'] = ['is_drunk'];
            }

            data['d_lat'] = data['lat'] - users[0]['lat'];
            data['d_lon'] = data['lon'] - users[0]['lon'];

            collection.update( { name : users[0]['name']}, data, callback);



        } else {
            console.log('user does not exits');

            var data = query;

            data['last_updated'] = Date.now();

            data['orig_lat'] = data['lat'];
            data['orig_lon'] = data['lon'];
            data['d_lat'] = 0;
            data['d_lon'] = 0;
            data['watchers'] = [];
            data['battery_level'] = -1;



            collection.insert(query, callback);


        }

        res.send(data['watchers']);

    //    last_updated: (time in ms), 
    //    battery_level: (decimal),
    //    orig_lat: 234,
    //    orig_lon: 435,
    //    d_lat: 3,
    //    d_lon: 2,

    });


}

//getUser: gets user data on request
var getUser = function(db, query, res, callback) {
    var collection = db.collection('users');
    collection.find({'watchers' : query['from']}).toArray(function(err, users) {
        if (users.length != 0) {
            var data_all = [];
            // handle alerts here.
            for (var i = 0; i < users.length; i++) {
                var data = users[i];

                if (! data.hasOwnProperty('alerts')) {
                    data['alerts'] = [];
                }

                // battery 
                if (data['battery_level'] >= 0 && data['battery_level'] < GLOBAL_BATTERY_MIN) {
                    data['alerts'].push('battery');
                }
                if (util.outOfBounds(data['orig_lat'], data['orig_lon'], 
                                     data['lat'], data['lon'], 
                                     GLOBAL_RADIUS_MAX)) {
                    data['alerts'].push('out_of_bounds');
                }
                if (util.calcVelocity(data['last_updated'], Date.now(), 
                                      util.calcDistance(0, 0, data['d_lat'], data['d_lon']))
                                      > GLOBAL_SPEED_MAX) {
                    data['alerts'].push('speeding');
                }
                if (Date.now() - data['last_updated'] > GLOBAL_MINUTES_MAX * 60 * 1000) {
                    data['alerts'].push('lost_track');
                }
                if (Date.now() - data['last_updated'] > 12 * 60 * 60 * 1000) {
                    data['alerts'].push('12_hour_lost');
                }

                data_all.push(data);
            }


            res.send(JSON.stringify(data_all));
        } else {
            res.send([]);
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
