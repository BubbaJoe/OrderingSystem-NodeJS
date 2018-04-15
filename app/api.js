const express = require('express'),
db = require('./database.js');
let app =  express();

// REST API
app.get('/viewCart', function(req, res) {
  var id = getSession(req)
  if(!!id) db.find("session_data",{session_id:id}, (r,err) => {
    if(!res.headersSent) {
      console.log("view",r)
      if (err) res.json({error:err})
      else if(!r) res.json({error:"No session found"})
      else res.json(r.products)
    } else {
      console.log("ERR","Headers already sent")
      res.status(503)
    }
  }); else res.json({error:"No session id"})
});

app.post('/updateCartItems', function(req, res) {
  if (req.fields) {
    let data = {}
    // Checks to see which keys have a value that is not ""
    for(let item in req.fields)
      if (req.fields[item] != "")
        data[item] = req.fields[item]
    // Finds and updates the data if data was set
    db.findUpdate("session_data",{session_id: getSession(req)},{$set: {products: data}},(r) => {
      res.json(r.value.products)
      console.log("SUCCESS", r)
    })
  } else {
    console.log("ERROR", req.fields)
    res.json({error:"No fields"})
  }
});

app.get('/getItem/:id', function(req, res) {
  if(!req.params.id) return
  let id =  req.params.id
  db.find("inventory",{itemid:id},(r) => {
    res.json(r)
  })
});

app.get('/getItems', function(req, res) {
  db.find("inventory",{},(r) => {
    res.json(r)
  })
});

app.listen(8081, process.env.IP || "0.0.0.0", function(){
  console.log("server listening at https://server-brimsonw16.c9users.io");
});