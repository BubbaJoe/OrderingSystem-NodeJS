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
    service: 'smtp.gmail.com',
    secure: true,
    port: 587,
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

// send the password email to the user
var sendClientEmail = (data, callback) => {
    mailOptions.subject = 'IBXPaint - New Order Received';
    mailOptions.to = client_email;
    const {full_name,phone_number,email_address,delivery_info,questions,order_id,itemlist} = data
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
			${full_name}<br>
			${phone_number}<br>
			${email_address}<br>
			${delivery_info}<br>
			${questions}<br></p>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			<h3>Order Information:</h3>
			Order Number: ${order_id}
			${itemlist}
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
}

// send the password email to the user
var sendUserEmail = (user_email,data,callback) => {
    mailOptions.subject = 'IBXPaint - Order Confirmation';
    mailOptions.to = user_email;
    const {order_id,itemlist} = data;
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
				font-family: 'Arial';
				margin: 0;">
			Your Order Has Been Received!</h1>
			
			<br>
			<br>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			Your Order Number is: ${order_id}</p>
			
			<br>
			<br>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
				Your Order Reciept:<br>
				${itemlist}
				</p>
			
			<br>
			<br>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			If you did not place this order or have any questions, please contact John Demotts at 252-758-7775. </p>
			
		</div>
	</body>
<html>`    
    
    transporter.sendMail(mailOptions, (err,info) => {
        if(err) console.log(err)
        else if(callback) return callback(info)
    }).catch(err => console.log("Couldn't send email",err))
}

mailer.sendEmails = function(session_id) {
	let order_id = generateOrderNumber()
	db.find('session_data', {session_id:session_id},
	(r) => {
		if(!r)
			console.log("SESSION NOT FOUND ERROR")
		else db.create('orderDetails',{data:r,order_id:order_id},
		(r) => {
			sendUserEmail(r.view.billing.email,r.view)
			sendClientEmail(r.view)
			console.log(r.view)
		})
	})
	// let cb = (r) => console.log(r)
	// sendClientEmail(data,cb)
	// sendUserEmail(user_email,data, cb)
}

module.exports = mailer;