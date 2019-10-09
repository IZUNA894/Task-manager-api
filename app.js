var express=require('express');
var appcontroller = require('./appcontroller');
var app= express();
appcontroller(app);

var port = process.env.PORT || 3000;
app.listen(port ,() => {
console.log("server is running")}
);
