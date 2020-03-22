var express = require("express");
var router = express.Router();
var Task= require('../db/task_module');
var auth = require("../middelware/auth_ware");


//creating a new task
router.post('/task',auth, async (req, res) => {
  try{

    var task = new Task({ ...req.body,owner:req.user._id})
    var task_data = await task.save();
    //await task_data.populate("owner").execPopulate();
    res.status(201).send(task_data);
  }
  catch(e){
    console.log(e);
    res.status(400).send(e);
  }

 })

 //to get all task of a user
router.get('/tasks',auth, async function(req,res){
try{
     var match={};
    if(req.query.completed)
    {
      match.completed = req.query.completed === "true"
    }

     var sort={};
     if(req.query.sortBy)
     {
       var parts=req.query.sortBy.split(":");
       sort[parts[0]] = parts[1] ==="desc"? -1:1;
     }

    await req.user.populate({ path:"tasks",
                              match,
                              options:{
                                limit:parseInt(req.query.limit),
                                skip:parseInt(req.query.skip),
                                sort
                              }}).execPopulate();

    res.send(req.user.tasks);
}
catch(e){
  res.send(e);

}

});

//to get a task details by his id
router.get('/tasks/:id',auth, async function(req,res){
try{
  var task = await Task.findOne({_id:req.params.id,owner:req.user._id});
  if(!task){
    throw new Error("cant find such task");    }
    res.send(task);
}
catch(e){
  res.status(404).send(e.toString());

}
});

//to update a task by his id
router.patch("/tasks/:id" , auth,async (req, res ) =>{
var allowedUpdates = ["work", "completed"];
var updates = Object.keys(req.body);
var isValidOperation = updates.every( (item)=> allowedUpdates.includes(item))
if(!isValidOperation)
res.status(400).send("ERROR:cant find the property you requested ");
try{
  var task = await Task.findOneAndUpdate({_id:req.params.id,owner:req.user._id},req.body,{new:true, runValidators:true});
  // var task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});
  if(!task)
  res.status(400).send("error")

  res.send(task);
}
catch(e){
  res.status(400).send(e);
}
});

//to delete a task by his id
router.delete("/tasks/:id" , auth , async (req,res) =>{
try{
  var task =  await Task.findOneAndRemove({_id:req.params.id,owner:req.user._id});
  if(!task)
  res.status(404).send();

  res.send(task);
}
catch(e)
{
  res.status(400).send(e.toString());
}
});
module.exports = router;
