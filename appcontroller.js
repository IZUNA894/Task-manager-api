var express = require('express');
require('./src/db/mongoose');
var UserRouter = require("./src/routers/user_routers");
var TaskRouter = require("./src/routers/task_routers");
module.exports=
  function(app)
  {
    app.use(express.json());
    app.use(UserRouter);
    app.use(TaskRouter);

  app.get('/',function(req,res)
  {
    res.send("hi there");
    res.end();
  });





  }
