/*
    @author Joe Williams
    Software Engineering : East Carolina University
    IBX Paint: Ordering Sysyem
    mailer.js - handles the communication for mailing services.
*/

const nodemailer = require('nodemailer'),
	db = require('./database');

let mailer = {},
	email = process.env.EMAIL,
    domain = process.env.DOMAIN,
    password = process.env.EMAIL_PASSWORD,
    client_email = process.env.CLIENT_EMAIL;
    
client_email = "brimsonw16@students.ecu.edu"
email = "ibxpaint.no.reply@gmail.com"
password = "AsDf1234"
domain = "server-brimsonw16.c9users.io"

if(!email || !domain || !password)
	console.log("ERR:", "EMAIL ENV VARS NOT SET")

function generateOrderNumber() {
	return Math.floor(Math.random() * 10000000) + 99999999
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
        user: email,
        pass: password
    },
    tls: {
        rejectUnauthorized: false
    }
})

// sets default mail params
let mailOptions = {
    from: '"IBXPaint" <'+email+'>',
    to: email
}

//	 _id: 5ad8a8375482c9ac68a444f2,
//   session_id: '535c51c0-43de-11e8-a614-e1f006036c94',
//   products: {},
//   shipping: {},
//   billing: 
//   { cardoption: 'on',
//      phone: '2522522525',
//      email: 'joewilliamsis@live.com',
//      cardnum: '',
//      month: '',
//      year: '',
//      address: '',
//      city: '',
//      zip: '',
//      state: 'IA' },
//   questions: {},
//   timestamp: 1524148830680

// send the password email to the user
var sendClientEmail = (data, order_id, callback) => {
    mailOptions.subject = 'IBXPaint - New Order Received';
    mailOptions.to = client_email;
    
    const {products, shipping, billing, questions, timestamp} = data
    
    var {order, name, date, time, address, city, statename, zipcode} = shipping
    
    if(shipping.order == "pick up") {
    	address = "N/A"
    	city = "N/A"
    	statename = "N/A"
    	zipcode = "N/A"
    }
    	
    var {payment, phone, email, bname, cardnum, month, year, baddress, bcity, bzip, bstate} = billing;
    
    if(billing.payment == "cash") {
    	bname = "N/A"
    	cardnum = "N/A"
    	month = "N"
    	year = "A"
    	baddress = "N/A"
    	bcity = "N/A"
    	bzip = "N/A"
    	bstate = "N/A"
    }
    
    const {whatpaint, wherepaint, optradio, askanything} = questions;
	const timeOfOrder = new Date(timestamp)
	
	let product_keys = Object.keys(products),
		productsf = "";
	
	let price = 0;
	
	product_keys.map((v, i) => {
		productsf += v.split("|")[0] + " : " + products[v] + " <br>";
		price += 39.99 * products[v];
	})
	
    mailOptions.html = 
`<html>
    <head>
		<meta charset="utf-8">
		<title>IBX Order</title>
		<meta name="viewport" content="width=device-width" />
	</head>
	<body style="margin: 0; padding: 0;">
		<div style="
			margin: 0 auto;
			max-width: 600px;
			text-align: center;">
			
			<center><img src="http://www.ibxpaint.com/AdminCenter/FileHandler.ashx?ID=69586" 
				style="
					display: block;
					height = 200%;
					width = 200%;
					padding: 12px 0;"
					alt="Benjamin Moore" /></center><br>
					
			<h1 style="
				font-family: 'Arial';
				margin: 0;">
			New Order Received!</h1>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			<h3>Customer Information:</h3>
			<strong>Name:</strong> ${name}<br>
			<strong>Phone:</strong> ${phone}<br>
			<strong>E-Mail:</strong> ${email}<br>
			<strong>Questions:</strong><br>
			<strong>Painting Location:</strong> ${wherepaint}<br>
			<strong>Painted Object:</strong> ${whatpaint}<br>
			<strong>Have Painter:</strong> ${optradio}<br>
			<strong>Questions for IBXPaint:</strong> ${askanything}<br></p>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			<h3>Order Information:</h3>
			<strong>Order Number:</strong> ${order_id}<br>
			<strong>Products:</strong> ${productsf}
			<strong>Price:</strong> $${price}<br></p>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			<h3>Shipping Information:</h3>
			<strong>Order:</strong> ${order}<br>
			<strong>Requested Date:</strong> ${date}<br>
			<strong>Requested Time:</strong> ${time}<br>
			<strong>Address:</strong> ${address}<br>
			<strong>City:</strong> ${city}<br>
			<strong>State:</strong> ${statename}<br>
			<strong>Zip Code:</strong> ${zipcode}<br></p>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			<h3>Billing Information:</h3>
			<strong>Cardholder Name:</strong> ${bname}<br>
			<strong>Payment Method:</strong> ${payment}<br>
			<strong>Card Number:</strong> ${cardnum}<br>
			<strong>Expiration Date:</strong> ${month}/${year}<br>
			<strong>Billing Address:</strong> ${baddress}<br>
			<strong>City:</strong> ${bcity}<br>
			<strong>State:</strong> ${bstate}<br>
			<strong>Zip Code:</strong> ${bzip}<br></p>
		</div>
	</body>
<html>`

    transporter.sendMail(mailOptions, (err,info) => {
        if(err) console.log(err)
        else if(callback) return callback(info)
        console.log("email sent to "+mailOptions.to)
    })
}

// send the password email to the user
var sendUserEmail = (user_email, data, order_id, callback) => {
    mailOptions.subject = 'IBXPaint - Order Confirmation';
    mailOptions.to = user_email;
    
    const {products, shipping, billing, questions, timestamp} = data
    
    var {order, name, date, time, address, city, statename, zipname} = shipping
    
    
    
    if(shipping.order == "pick up") {
    	address = "N/A"
    	city = "N/A"
    	statename = "N/A"
    	zipname = "N/A"
    }
    
     var {payment, phone, email, bname, cardnum, month, year, baddress, bcity, bzip, bstate} = billing;
    
    let product_keys = Object.keys(products),
		productsf = "";
	
	let price = 0;
	
	product_keys.map((v, i) => {
		productsf += v.split("|")[0] + " : " + products[v] + " items <br>";
		price += 39.99 * products[v];
	})
    
    mailOptions.html = 
`<html>
    <head>
		<meta charset="utf-8">
		<title>Order Confirmation</title>
		<meta name="viewport" content="width=device-width" />
	</head>
	<body style="margin: 0; padding: 0;">
		<div style="
			margin: 0 auto;
			max-width: 600px;
			text-align: center;">
			
			<center><img src="http://www.ibxpaint.com/AdminCenter/FileHandler.ashx?ID=69586" 
				style="
					display: block;
					height = 200%;
					width = 200%;
					padding: 12px 0;"
					alt="Benjamin Moore" /></center>
					
			<h1 style="
				font-family: "Arial";
				margin: 0;">
			Your Order Has Been Received!</h1>
			
			<p style="
				font-family: "Arial";
				margin: 0;">
			<h3>Your Order Receipt:</h3>
			<strong>Order Number:</strong> ${order_id}<br>
			<strong>Products:</strong><br>${productsf}
			<strong>Price:</strong> $${price}<br></p>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			<h3>Shipping Information:</h3>
			<strong>Order:</strong> ${order}<br>
			<strong>Requested Date:</strong> ${date}<br>
			<strong>Requested Time:</strong> ${time}<br>
			<strong>Address:</strong> ${address}<br>
			<strong>City:</strong> ${city}<br>
			<strong>State:</strong> ${statename}<br>
			<strong>Zip Code:</strong> ${bzip}<br></p>
			
			<p style="
				font-family: "Arial";
				margin: 0;">
			If you did not place this order or have any questions, please contact John Demotts at 252-758-7775. </p>
			
		</div>
	</body>
<html>` 
    
    transporter.sendMail(mailOptions, (err,info) => {
        if(err) console.log(err)
        else if(callback) return callback(info)
        console.log("email sent to "+mailOptions.to)
    })
}

mailer.sendEmails = function(session_id,cb) {
	let order_id = generateOrderNumber()
	db.find('session_data', {session_id:session_id},
	(insert, err) => {
		if(err) console.log("SESSION NOT FOUND ERROR",err,insert)
		else if(insert) {
			// Create official order
			db.remove("session_data", {session_id: session_id});
			db.create('order_details',{details:insert, order_id: order_id})
			// Send email to user
			sendUserEmail(insert.billing.email, insert, order_id)
			// Send email to client
			sendClientEmail(insert,order_id)
		} else {
			console.log("ERROR: COULD NOT SEND EMAIL!",insert)
		}
	})
}

module.exports = mailer;