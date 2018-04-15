/*
    @author Joe Williams
    Software Engineering : East Carolina University
    PirateNotes
    email.js - handles on communication of the web server to the mail server.
*/
let nodemailer = require('nodemailer')

/*
let email = process.env.EMAIL,
    domain = process.env.DOMAIN;

let transporter = nodemailer.createTransport({
    service: 'smtp.gmx.com',
    secure: false,
    port: 587,
    auth: {
        user: email,
        pass: process.env.EMAIL_PASSWORD
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
var sendEmail = (to_email,callback) => {
    mailOptions.subject = 'IBXPaint - New Order Received'
    mailOptions.to = user_email
    
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
			$(full_name)<br>
			$(phone_number)<br>
			$(email_address)<br>
			$(delivery_info)<br>
			$(questions)<br></p>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			<h3>Order Information:</h3>
			$(item) : $(quantity)<br></p>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
			<h3>Billing Information:</h3>
			$(cardholder_name)<br>
			$(payment_type)<br>
			$(card_number)<br>
			$(expiration_month)/$(expiration_year)<br>
			$(full_address)<br>
			$(city)<br>
			$(state)<br>
			$(zip_code)<br>
			</p>
			
		</div>
	</body>
<html>`

// send the password email to the user
var sendEmail = (to_email,callback) => {
    mailOptions.subject = 'IBXPaint - Order Confirmation'
    mailOptions.to = user_email
    
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
			Your Order Number is: $(session_id)</p>
			
			<br>
			<br>
			
			<p style="
				font-family: 'Arial';
				margin: 0;">
				Your Order Reciept:<br>
				$(item) : $(quantity)<br>
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
        else if(callback) return callback(user)
    })
        
    .catch(err => console.log("Couldn't send email",err))
}
*/