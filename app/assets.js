const express = require('express')
let app =  express();

app.use('/assets', express.static('../public'))

app.listen(8082, process.env.IP || "0.0.0.0", function(){
  console.log("server listening at https://server-brimsonw16.c9users.io");
});