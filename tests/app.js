var express=require('express');
var appcontroller = require('../appcontroller');
var app= express();
appcontroller(app);
module.exports = app;
