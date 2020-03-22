// this file is redundent...
// its just for practice...no role in working of app
var add= (num1 , num2) =>{
  return new Promise((resolve ,reject ) => {


  setTimeout(function () {

    resolve(num1 + num2);
  }, 2000);
});
}
const func = async () =>{
  var sum1 = await add(1,2);
  var sum2 = await add(sum1,2);
  var sum3 = await add(sum2,3);
  return sum3;
}




func().then( (user)=>{
  console.log(user);
}).catch((err) => {
  console.log("error" + err);
});
