var express = require("express");
var router = express.Router();
var User= require('../db/user_module');


router.get('/users', async function(req,res)
{
   try
     {

     var users = await User.find({});
     res.send(users);
   } catch (e) {
     res.status(400).send(e);
   }

});

router.get('/users/:id',async function(req,res){
  try{
    var users = await User.findById(req.params.id);
    if(!users)
    {
      throw new Error("cant find any users with given id ");
    }
    res.send(users);
  }
  catch(e){
    res.send(e);
  }

});

router.patch("/users/:id" , async (req, res ) =>{
 var allowedUpdates = ["name", "email", "password","age"];
 var updates = Object.keys(req.body);
 var isValidOperation = updates.every( (item)=> allowedUpdates.includes(item))
 if(!isValidOperation)
 res.status(400).send("ERROR:cant find the property you requested ");
 try{
   var user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});
   if(!user)
   res.status(400).send("error")

   res.send(user);
 }
 catch(e){
   res.status(400).send(e);
 }
});


router.delete("/users/:id" , async (req,res) =>{
try{
  var user =  await User.findByIdAndDelete(req.params.id);
  if(!user)
  res.status(404).send();

  res.send(user);
}
catch(e)
{
  res.status(400).send(e);
}
})

router.post('/users', async function(req,res){
 try{
   var user = new User(req.body);
   var user_data = await user.save();
   res.send(user_data);
 }
  catch(e)
  {
    res.status(400).send(e);
  }

});

module.exports= router;
