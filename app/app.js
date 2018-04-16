/*
    @author Joe Williams
    Software Engineering 2: East Carolina University
    IBX Paint: Ordering Sysyem
    app.js - Creates the server, and initializes all data.
*/

'use strict';

const express =   require('express'),
  uuid =          require('uuid/v1'),
  parser =        require('cookie-parser'),
  form =          require('express-formidable'),
  db =            require('./database.js'),
  path =          require('path'),
  mailer =        require('./mailer.js');

let app =  express();

//TODO: FRONT END: Text box sizable, Update validation,
//TODO:   Center, Change & Add button names, update links
//TODO: BACK END: Mailer, update database functions

process.setMaxListeners(0);
app.use(parser());
app.use(form());

/* ------------- Routes ---------------- */

// Static
app.use('/assets', express.static('../public'))

// checks every request to make sure the 
app.use(function(req, res, next) {
  if (!getSession(req)) setSession(req, res)
  next()
})

// Landing Page
app.get('/', function(req, res) {
  res.redirect('/home')
});

app.get('/session_analyzer', function(req, res) {
  // if the user's session is valid
  // perform session checking
  res.redirect('/home')
});

app.post('/products', function(req, res) {
  // Update the session time
  res.redirect("questions")
});

app.post('/questions', function(req, res) {
  let questions = req.fields;
  db.update('session_data',{
    session_id: getSession(req)
  },{
    questions: questions,
    timestamp: Date.now()
  },() => {
    res.redirect("shipping")
  });
});

app.post('/billing', function(req, res) {
  let billing = req.fields;
  db.update('session_data',{
    session_id: getSession(req)
  },{
    billing: billing,
    timestamp: Date.now()
  },() => {
    res.redirect("thankyou")
  });
});

app.post('/shipping', function(req, res) {
  let shipping = req.fields;
  db.update('session_data',{
    session_id: getSession(req)
  },{
    shipping: shipping,
    timestamp: Date.now()
  },() => {
    res.redirect("billing")
  });
});

app.post('/submit', function(req, res) {
  mailData(getSession(req));
  res.redirect("thankyou");
});

app.get('/home', function(req, res) {
  sendView(res,"home.html")
});

app.get('/products', function(req, res) {
  sendView(res,"products.html")
});

app.get('/billing', function(req, res) {
  sendView(res,"billing.html")
});

app.get('/shipping', function(req, res) {
  sendView(res,"shipping.html")
});

app.get('/questions', function(req, res) {
  sendView(res,"questions.html")
});

app.get('/thankyou', function(req, res) {
  sendView(res,"thankyou.html")
});

// REST API
app.get('/viewCart', function(req, res) {
  var id = getSession(req)
  if(id) db.find("session_data",{session_id:id}, (r,err) => {
    if(!res.headersSent) {
      console.log("view",r)
      if (err) res.json({error:err})
      else if(!r) res.json({error:"No session found"})
      else {
        if (Object.keys(r).length > 0) res.json(r.products)
        else res.json({error:"No items"})
      }
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
      if (r && r.value && r.value.products != "")
        res.json(data)
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

// Helper Functions
function setSession(req, res) {
  let id = uuid();
  db.create("session_data", {
      session_id: id,
      products: {},
      shipping: {},
      billing: {},
      questions: {},
      timestamp: Date.now()
    }, (r, err) => {
      if (err) console.log("SESSION CREATE ERR",err)
      else console.log("SESSION CREATED",r)
    });
  res.cookie('session_id', id, { maxAge: 1000000 });
}

function getSession(req) {
  let sid = req.cookies.session_id
  return (sid) ? sid : undefined;
}

function removeSession(res, id) {
  res.cookie('session_id', '', { maxAge: -1 });
  db.remove("sessions", {session_id: id});
}

function sendView(res, filename) {
  res.sendFile(path.join(`${__dirname}/../views/${filename}`));
}

// Application arguments
let port = 8080, ip = "127.0.0.1";
if (process.argv.length > 2)
  port = parseInt(process.argv[2]);

if(process.env.IP && !process.argv.contains('-p'))
  ip = process.env.IP

app.listen(port, ip,
  ()=>console.log("server started on port: "+port+" on "+ip));
