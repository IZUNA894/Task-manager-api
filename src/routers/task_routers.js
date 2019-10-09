var express = require("express");
var router = express.Router();
var Task= require('../db/task_module');


router.post('/task', async (req, res) => {
  try{
    var task = new Task(req.body)
    var task_data = await task.save();
    res.status(201).send(task_data);
  }
  catch(e){
    res.status(400).send(e);
  }

 })

router.get('/tasks', async function(req,res){
try{
  var task =  await Task.find({});

    res.send(task);
}
catch(e){
  res.send(e);

}

});

router.get('/tasks/:id', async function(req,res){
try{
  var task = await Task.findById(req.params.id);
  if(!task){
    throw new Error("cant find such task");    }
    res.send(task);
}
catch(e){
  res.send(e);

}
});


router.patch("/tasks/:id" , async (req, res ) =>{
var allowedUpdates = ["work", "completed"];
var updates = Object.keys(req.body);
var isValidOperation = updates.every( (item)=> allowedUpdates.includes(item))
if(!isValidOperation)
res.status(400).send("ERROR:cant find the property you requested ");
try{
  var task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});
  if(!task)
  res.status(400).send("error")

  res.send(task);
}
catch(e){
  res.status(400).send(e);
}
});


router.delete("/tasks/:id" , async (req,res) =>{
try{
  var task =  await Task.findByIdAndDelete(req.params.id);
  if(!task)
  res.status(404).send();

  res.send(task);
}
catch(e)
{
  res.status(400).send(e);
}
});
module.exports = router;
