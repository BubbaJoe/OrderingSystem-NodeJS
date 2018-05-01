/*
    @author Joe Williams
    Software Engineering 2: East Carolina University
    IBX Paint: Ordering Sysyem
    app.js - Creates the server, and initializes modules.
*/

'use strict';

const express =   require('express'),
  uuid =          require('uuid/v1'),
  parser =        require('cookie-parser'),
  form =          require('express-formidable'),
  path =          require('path'),
  db =            require('./database.js'),
  mailer =        require('./mailer.js');

let app =  express();

process.setMaxListeners(0);
app.use(parser());
app.use(form());

/* ------------------ Routes ------------------- */

// If the user has no sesh, GIVE 'EM A SESH!
app.use(function(req, res, next) {
  if (!getSession(req)) 
    setSession(req, res)
  next()
})

// Checks every request to make sure the 
app.post(function(req, res, next) {
  if (getSession(req)) {
    db.find('session_data',
    {session_id:getSession(req)},
    (r,err) => {
      if(err) {
        res.cookie('session_id', '', { maxAge: -1 })
        res.redirect('/home')
        return
      }
      console.log("Post Information",r.view)
      if(Object.keys(r.view.products).length == 0)
        res.redirect('/home')
      else next()
    })
  }
})

// Landing Page
app.get('/', function(req, res) {
  res.redirect('/home')
});

// 
app.get('/invalidsession', function(req, res) {
  removeSession(res, getSession())
  res.redirect('/home')
});

// 
app.post('/products', function(req, res) {
  // Update the session time
  db.find('session_data',
  {session_id:getSession(req)},
    (r,err) => {
      if(err) return res.redirect("/home?err=session")
      let len = Object.keys(r["products"] || {}).length
      if(len > 0)
        res.redirect("/questions")
      else {
        res.redirect("/products/?err=sel_prod")
      }
  });
});

// 
app.post('/questions', function(req, res) {
  let questions = req.fields;
  db.update('session_data',
    {session_id: getSession(req)},
    {questions: questions,
    timestamp: Date.now()},
    () => {
      res.redirect("/shipping")
    });
});

// 
app.post('/billing', function(req, res) {
  let billing = req.fields, sid = getSession(req);
  db.update('session_data',
    {session_id: sid},
    {billing: billing,
    timestamp: Date.now()},
    () => {
      mailer.sendEmails(sid);
      removeSession(res);
      res.redirect("/thankyou");
  });
});

// 
app.post('/shipping', function(req, res) {
  let shipping = req.fields;
  db.update('session_data',
    {session_id: getSession(req)},
    {shipping: shipping,
    timestamp: Date.now()},
    () => {res.redirect("billing")});
});

// Possible last page before end? Confirm order page?
app.post('/review', function(req, res) {
  res.send('')
})

// 
app.post('/submit', function(req, res) {
  mailer.sendEmails(getSession(req));
  res.redirect("thankyou");
});

// View
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

// Cart System
app.get('/viewCart', function(req, res) {
  var id = getSession(req)
  if(id) db.find("session_data",{session_id:id}, (r,err) => {
    if(!res.headersSent) {
      if (err) res.json({error:err})
      else if(!r) res.json({error:"No session found"})
      else {
        if (Object.keys(r).length > 0) res.json(r.products)
        else res.json({error:"No items"})
      }
    } else console.log("viewCart error")
  }); else res.json({error:"No session id"})
});

app.post('/updateCartItems', function(req, res) {
  if (req.fields) {
    let data = {}
    // Checks to see which keys have a value that is not ""
    for(let item in req.fields)
      if (req.fields[item] != "0")
        data[item] = req.fields[item]
    // Finds and updates the data if data was set
    db.findUpdate("session_data",{session_id: getSession(req)},{$set: {products: data}},(r) => {
      if (r && r.value && r.value.products != "") res.json(r.value.products)
    })
  } else {
    console.log("updateCartItems error")
    res.json({error:"No fields"})
  }
});

app.get('/removeCartItem/:item_id',function (req, res) {
  let id = req.params.item_id, sid = getSession(req)
  if(!id || !sid) return res.status(400).send("Incorrect format")
  db.find('session_data',{session_id:sid},
  function(r, err) {
    if(err) res.json({error:"session error"})
    else {
      delete r.products[id]
      db.findUpdate('session_data',
        {session_id:sid},
        {$set:{products:r.products}},
        () => res.json({}))
    }
  })
})

app.get('/getItems', function(req, res) {
  db.find("inventory",{},(r) => {
    res.json(r)
  })
});

/* ------------- Helpers ---------------- */

function setSession(req, res) {
  let id = uuid();
  db.create("session_data", {
      session_id: id, products: {},
      shipping: {}, billing: {},
      questions: {}, timestamp: Date.now()
    }, (r, err) => {
      if (err) console.log("Could not create session")
    });
  res.cookie('session_id', id, { maxAge: 1000000 });
}

function getSession(req) {
  let sid = req.cookies.session_id
  return (sid) ? sid : "";
}

function removeSession(res) {
  res.cookie('session_id', '', { maxAge: -1 });
}

function sendView(res, filename) {
  res.sendFile(path.join(`${__dirname}/../views/${filename}`));
}

// Application arguments
let port = 8080, ip = "0.0.0.0",
args = process.argv;

if(process.env.IP)
  ip = process.env.IP

if(args.includes('-p')) {
  ip = "127.0.0.1"
  let index = args.indexOf('-p')
  if (index > -1) args.splice(index, 1)
}

if (args.length > 2) port = parseInt(process.argv[2]);

app.listen(port, ip, () => 
  console.log(`Serving at ${ip}:${port}`)
);