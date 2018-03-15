// Imports
const http =  require('http'),
  express =   require('express'),
  uuid =      require('uuid/v1'),
  //mailer =    require('nodemailer'),
  parser =    require('cookie-parser'),
  form =      require('express-formidable');

let router =  express(),
  mongo =     require('mongodb').MongoClient,
  server =    http.createServer(router),
  url = "mongodb://admin:admin@ds215089.mlab.com:15089/ibxpaint";

//TODO: FRONT END: Text box sizable, Update validation,
//TODO:   Center, Change & Add button names, update links
//TODO: BACK END: Mailer, update database functions, restart if no session 
//TODO: Database: Put product codes, in the database along with the name

process.setMaxListeners(0);
router.use(parser());
router.use(form());

// Async mongodb custom functions
function query(cb) {
  mongo.connect(url, function(err, mongo) {
    if (err) return fatal(err);
    let r = cb(mongo.db('ibxpaint'));
    mongo.close();
    return r;
  });
}

async function find(colString, data) {
  return await query(function(db) {
    let result;
    db.collection(colString).findOne(data, function(err, r) {
      if (err) return fatal(err);
      else result = r;
    });
    return result;
  });
}

async function findAll(colString, data) {
  return await query(function(db) {
    let result;
    db.collection(colString).find(data).toArray(function(err, r) {
      if (err) return fatal(err);
      else result = r;
    });
    return result;
  });
}

async function create(colString, data) {
  return await query(function(db) {
    let result;
    db.collection(colString).insertOne(data, function(err, r) {
      if (err) return fatal(err);
      else result = r;
    });
    return result;
  });
}

async function update(colString, find, data) {
  return await query(function(db) {
    db.collection(colString).updateOne(find, {$set:data}, function(err, r) {
      if (err) return fatal(err);
    });
  });
}

async function remove(colString, find) {
  return await query(function(db) {
    db.collection(colString).deleteOne(find, function(err, r) {
      if (err) return fatal(err);
    });
  });
}

// Routes
router.use(express.static('public'));

router.get('/', function(req, res) {
  if (!getSession(req)) {
    let id = uuid();
    setSession(res, id);
    create("sessions", {
      session_id: id,
      time: Date.now()
    });
    res.redirect("home.html");
  } else {
    let session_data = find("sessions", {session_id:getSession(req)});
    if (session_data.last_page) {
      console.log("Continuing where they left off" + session_data);
      res.redirect(session_data.last_page);
    } else {
      console.log("User already has has data: " + session_data);
      res.redirect("home.html");
    }
  }
});

router.post('/products', function(req, res) {
  let products = {};
  for (var k in req.fields)
    if (req.fields[k] != 'QTY')
      products[k] = req.fields[k];
  console.log(products);
  create('products',{
    session_id: getSession(req),
    products: products,
    time: Date.now()
  });
  res.redirect("questions.html");
});

router.post('/billing', function(req, res) {
  let billingInfo = req.fields;
  create('billing',{
    session_id: getSession(req),
    billing: billingInfo,
    time: Date.now()
  });
  res.redirect("thankyou.html");
});

router.post('/shipping', function(req, res) {
  let shippingInfo = req.fields;
  create('shipping',{
    session_id: getSession(req),
    shipping: shippingInfo,
    time: Date.now()
  });
  res.redirect("billing.html");
});

router.post('/questions', function(req, res) {
  let questions = req.fields;
  create('questions',{
    session_id: getSession(req),
    questions: questions,
    time: Date.now()
  });
  res.redirect("shipping.html");
});

router.post('/submit', function(req, res) {
  mailData(getSession(req));
  res.redirect("thankyou.html");
});

// REST API
router.get('/viewCart', function(req, res) {
  findAll("inventory",{});
});

router.post('/updateCartItem', function(req, res) {
  findAll("inventory",{});
});

router.post('/removeCartItem', function(req, res) {
  findAll("inventory",{session_id:getSession(req)});
});

router.get('/getProducts', function(req, res) {
  findAll("inventory",{});
});

router.post('/addProduct', function(req, res) {
  create("inventory",{test:"test"});
});

router.post('/removeProduct', function(req, res) {
  remove("inventory",{test:"test"});
});

router.post('/updateProduct', function(req, res) {
  update("inventory",{test:"test"});
});

// Helper Functions

function setSession(res, id) {
  res.cookie('session_id', id, { maxAge: 900000 });
}

function getSession(req) {
  return req.cookies.session_id;
}

function fatal(err) {
  console.log("Fatal ", err);
  process.exit(1);
}

// Nodemailer

function mailData(session_id) {
  // Get all the data from each table,
  // Make a reciept format and send it
  // the user.
}

server.listen(process.env.PORT || 80, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});