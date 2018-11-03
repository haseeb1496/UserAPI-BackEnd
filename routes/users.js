var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongo_client = mongo.MongoClient;
var url = 'mongodb://localhost:27017/';

router.route('/')
    .post(function(req, res){

        var record = req.body;

        mongo_client.connect(url, function(err, db) {

            if (err)
                throw err;

            var dbo = db.db('usersdb');

            dbo.collection('Users').insertOne(record, function(error, response){

                if (error)
                    throw error

                else
                {
                    res.status(201).send(record);
                    db.close();
                }
            });

        });

    })
    .get(function(req,res){

        mongo_client.connect(url, function(err, db){

            if(err)
                throw err;

            var dbo = db.db('usersdb');

            if(req.query.age && req.query.op)
            {
                age = parseInt(req.query.age);
                q = {};

                if (req.query.op == 'lt')
                    q = {age: {$lt : age}};
                if (req.query.op == 'lte')
                    q = {age: {$lte : age}};
                if (req.query.op == 'gt')
                    q = {age: {$gt : age}};
                if (req.query.op == 'gte')
                    q = {age: {$gte : age}};
                if (req.query.op == 'eq')
                    q = {age: {$eq : age}};
                if (req.query.op == 'ne')
                    q = {age: {$ne : age}};

                dbo.collection('Users').find(q).toArray(function(err, users){

                    if(err)
                        res.status(500).send(err);
                    else
                    {
                        res.json(users);
                        console.log(users);
                        db.close();
                    }
                });
            }
            else {
                dbo.collection('Users').find().toArray(function (err, users) {

                    if (err)
                        res.status(500).send(err);
                    else {
                        res.json(users);
                        db.close();
                    }

                });
            }

        });
    });

router.route('/:userID')
    .get(function (req, res){

        mongo_client.connect(url, function(err, db){

            if(err)
                throw err;

            var dbo = db.db('usersdb');
            var searchId = new mongo.ObjectId(req.params.userID);

            dbo.collection('Users').findOne({'_id': searchId}, function(err, user){

                if(err)
                {
                    res.status(500).send(err);
                    throw err;
                }
                else
                {
                    res.json(user);
                    db.close();
                }

            });
        });

    })
    .put(function (req, res){

        mongo_client.connect(url, function(err, db){

            if(err)
                throw err;

            var dbo = db.db('usersdb');
            var searchId = new mongo.ObjectId(req.params.userID);

            dbo.collection('Users').update({'_id': searchId}, {'firstName': req.body.firstName, 'lastName': req.body.lastName, 'age': req.body.age, 'salary': req.body.salary, 'city': req.body.city, 'address': req.body.address}, function(err, user){

                if(err)
                {
                    res.status(500).send(err);
                    throw err;
                }
                else
                {
                    res.send(200);
                    db.close();
                }

            });
        });

    })
    .delete(function(req, res){

        mongo_client.connect(url, function(err, db){

            if(err)
                throw err;

            var dbo = db.db('usersdb');
            var searchId = new mongo.ObjectId(req.params.userID);

            dbo.collection('Users').deleteOne({'_id': searchId}, function(err, user){

                if(err)
                {
                    res.status(500).send(err);
                    throw err;
                }
                else
                {   res.status(200).send(user);
                    db.close();
                }

            });
        });

    });

router.route('/city/find')
    .get(function (req, res){

        mongo_client.connect(url, function(err, db){

            if(err)
                throw err;

            var dbo = db.db('usersdb');

            dbo.collection('Users').aggregate([
                {
                    $group:{
                        _id:"$city",
                        count:{$sum:1}
                    }
                }
            ]).toArray( function (err, user) {

                if(err)
                {
                    res.status(500).send(err);
                    throw err;
                }
                else
                {
                    res.send(user);
                    db.close();
                }

            });
        });

    });

module.exports = router;
