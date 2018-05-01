/*
    @author Joe Williams
    Software Engineering 2: East Carolina University
    IBX Paint: Ordering Sysyem
    database.js - handles the communication for the database.
*/
const mongo = require('mongodb').MongoClient,
  URL = "mongodb://admin:admin@ds215089.mlab.com:15089/ibxpaint?socketTimeoutMS=1500";

// URL = `mongodb://${username}:${password}@${host}:${port}/${database}?socketTimeoutMS=1500`

var database = {};

// Async mongodb custom functions
function query(cb) {
  mongo.connect(URL, function(err, mongo) {
    if(err) return console.log("DB CONN ERROR:",err);
    else return cb(mongo.db('ibxpaint'));
  });
}

database.find = function(colString, data, callback) {
  query(function(db) {
    db.collection(colString).findOne(data, function(err, r) {
      if(callback)callback(r,err);
    });
  });
}

database.findUpdate = function(colString, find, update, callback) {
  query(function(db) {
    db.collection(colString).findOneAndUpdate(
      find,
      update,
      {returnNewDocument: true}
      ).then((r) => callback(r))
  });
}

database.findAll = function(colString, data, callback) {
  query(function(db) {
    db.collection(colString).find(data).toArray(function(err, r) {
      if(callback)callback(r,err);
    });
  });
}

database.create = function(colString, data, callback) {
  query(function(db) {
    db.collection(colString).insertOne(data, function(err, r) {
      if(callback)callback(r,err);
    });
  });
}

database.update = function(colString, find, data, callback) {
  query(function(db) {
    db.collection(colString).updateOne(find, {$set: data}, function(err, r) {
      if(callback) callback(r);
      if(err) console.log(err)
    });
  });
}

database.remove = function(colString, find, callback) {
  query(function(db) {
    db.collection(colString).deleteOne(find, function(err, r) {
      if(callback)callback(r,err);
    });
  });
}

module.exports = database;