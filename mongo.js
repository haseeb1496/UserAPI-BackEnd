var mongo = require('mongodb');

var module = require("/home/haseeb/Desktop/git_request.js");

var mongo_client = mongo.MongoClient;

var url = 'mongodb://localhost:27017/';

module.mod('OllieParsley', function(objs){

	console.log('Records Retreived');
	
	mongo_client.connect(url, function(err, db) {

		if (err)
			throw err;
		var dbo = db.db('ReposDB');
//		dbo.createCollection('Repos', function(error, response){
//
//			if(error)
//				throw error;
//			console.log('Collection Created');
//
//		});
//
//		dbo.collection('Repos').insertMany(objs, function(error, response){
//
//			if (error)
//				throw error
//			console.log('Entry Made!');
//
//		});
//
		dbo.collection('Repos').find().toArray(function(error, result){
			
			if (error)
				throw error;
			console.log('Result Count:', result);
			db.close();

		});		

	});
	
});