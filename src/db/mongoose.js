var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_LINK , {useNewUrlParser:true}).then(()=>{
   console.log("succesfulluy connected to mongodb");
})
.catch((error)=>{console.log("error in connnecting to mongo server" , error)});
