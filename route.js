var x = require('express');

var mongo = require('mongodb');

var mongo_client = mongo.MongoClient;

var url = 'mongodb://localhost:27017/';

var routes = function(){

    var router = x.Router();

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
                dbo.collection('Users').find().toArray(function(err, users){

                    if(err)
                        res.status(500).send(err);
                    else
                    {
                        res.json(users);
                        console.log('Records:', users.length);
                        db.close();
                    }

                });

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

                dbo.collection('Users').update({'_id': searchId}, {'name': req.body.name, 'desc': req.body.desc}, function(err, user){

                    if(err)
                    {
                        res.status(500).send(err);
                        throw err;
                    }
                    else
                    {
                        res.send('Successfully Updated!');
                        db.close();
                    }

                });
            });

        })
        .patch(function(req, res){

            mongo_client.connect(url, function(err, db){

                if(err)
                    throw err;

                var dbo = db.db('usersdb');
                var searchId = new mongo.ObjectId(req.params.userID);

                dbo.collection('Users').findOne({'_id': searchId}, function(error, user){

                    if(req.body._id)
                        delete req.body._id;

                    for(var n in req.body)
                        user[n] = req.body[n];

                    dbo.collection('Users').update({'_id': searchId}, user, function(err, suc){


                        if(err)
                        {
                            res.status(500).send(err);
                            throw err;
                        }
                        else
                        {
                            res.send('Successfully Updated!');
                            db.close();
                        }

                    });

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
                    {
                        res.send('Successfully Removed!');
                        db.close();
                    }

                });
            });

        });

    return router;

};

module.exports = routes;