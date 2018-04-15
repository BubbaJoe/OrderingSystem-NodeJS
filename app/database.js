const mongo = require('mongodb').MongoClient,
  URL = "mongodb://admin:admin@ds215089.mlab.com:15089/ibxpaint?socketTimeoutMS=1500";

var methods = {};

// Async mongodb custom functions
function query(cb) {
  mongo.connect(URL, function(err, mongo) {
    if(err) return console.log(err);
    else cb(mongo.db('ibxpaint'));
  });
}

methods.find = function(colString, data, callback) {
  query(function(db) {
    db.collection(colString).findOne(data, function(err, r) {
      if(callback)callback(r,err);
    });
  });
}

methods.findUpdate = function(colString, find, update, callback) {
  query(function(db) {
    db.collection(colString).findOneAndUpdate(
      find,
      update,
      {returnNewDocument: true}
      ).then((r) => {
        callback(r)
        console.log(r)
      })
  });
}

methods.findAll = function(colString, data, callback) {
  query(function(db) {
    db.collection(colString).find(data).toArray(function(err, r) {
      if(callback)callback(r,err);
    });
  });
}

methods.create = function(colString, data, callback) {
  query(function(db) {
    db.collection(colString).insertOne(data, function(err, r) {
      if(callback)callback(r,err);
    });
  });
}

methods.update = function(colString, find, data, callback) {
  query(function(db) {
    db.collection(colString).updateOne(find, {$set: data}, function(err, r) {
      if(callback) callback(r);
      if(err) console.log(err)
    });
  });
}

methods.remove = function(colString, find, callback) {
  query(function(db) {
    db.collection(colString).deleteOne(find, function(err, r) {
      if(callback)callback(r,err);
    });
  });
}

module.exports = methods;