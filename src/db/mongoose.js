var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/users" , {useNewUrlParser:true}).then(()=>{
   console.log("succesfulluy connected to mongodb");
})
.catch((error)=>{console.log("error in connnecting to mongo server" , error)});
