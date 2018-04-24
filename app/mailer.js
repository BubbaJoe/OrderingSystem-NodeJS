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
    
client_email = "skbubba@icloud.com"
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
    const {delivery, name, date, address, city, statename, zipname} = shipping
    if(billing.cardoption != "") var {cardoption, phone} = billing
    else var {cardoption, phone, email, cardnum, month, year, baddress, bcity, bzip, bstate} = billing
    const {whatpaint, wherepaint, askanything} = questions
	const timeOfOrder = new Date(timestamp)
	
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
			
			<center><img src="/img/logo.png" 
				style="
					display: block;
					max-width: 25%;
					padding: 12px 0;"
					alt="Benjamin Moore" /></center>
					
			<h1 style="
				font-family: 'Arial';
				margin: 0;">
			New Order Received!</h1>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			<h3>Customer Information:</h3>
			${1}<br>
			${1}<br>
			${1}<br>
			${1}<br>
			${1}<br></p>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			<h3>Order Information:</h3>
			Order Number: ${order_id}
			${JSON.stringify(data,null,3)}
			</p>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			<h3>Billing Information:</h3>`
			// ${cardholder_name}<br>
			// ${payment_type}<br>
			// ${card_number}<br>
			// ${expiration_month}/${expiration_year}<br>
			// ${full_address}<br>
			// ${city}<br>
			// ${state}<br>
			// ${zip_code}<br>
			+`</p>
			
		</div>
	</body>
<html>`

    transporter.sendMail(mailOptions, (err,info) => {
        if(err) console.log(err)
        else if(callback) return callback(info)
        console.log("emailing done")
    })
}

// send the password email to the user
var sendUserEmail = (user_email, data, order_id, callback) => {
    mailOptions.subject = 'IBXPaint - Order Confirmation';
    mailOptions.to = user_email;
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
			
			<center><img src="/img/logo.png" 
				style="
					display: block;
					max-width: 25%;
					padding: 12px 0;"
					alt="Benjamin Moore" /></center>
					
			<h1 style="
				font-family: "Arial";
				margin: 0;">
			Your Order Has Been Received!</h1>
			
			<br>
			<br>
			
			<p style="
				font-family: "Arial";
				margin: 0;">
			Your Order Number is: ${order_id}</p>
			
			<br>
			<br>
			
			<p style="
				font-family: "Arial";
				margin: 0;">
				Your Order Reciept:<br>
				${JSON.stringify(data,null,3)}
				</p>
			
			<br>
			<br>
			
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
        console.log("emailing done")
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
			sendClientEmail(insert,order_id,cb)
		} else {
			console.log("ERROR: COULD NOT SEND EMAIL!",insert)
		}
	})
}

module.exports = mailer;