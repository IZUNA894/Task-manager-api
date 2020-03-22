const request = require("supertest");
var mongoose = require("mongoose");
var jwt= require("jsonwebtoken");
const app = require("./app");
const user = require("../src/db/user_module.js");

//cleaning the database...
var userOneId =new mongoose.Types.ObjectId();
var userOne = {
_id:userOneId,
name:"sam",
age:20,
email:"sanyamco@gmail.com",
password:"blablabla",
tokens:[
  {
    token:jwt.sign({_id:userOneId},process.env.JWT_SECRET_KEY)
  }
]}

beforeEach(async ()=>{
await user.deleteMany();
await new user(userOne).save();
});
//basic test....
test("basic testup",async ()=>{
  await request(app).get("/").expect("hi there");
});

//creating a new user...
test("creating new user",async ()=>{
  await request(app)
  .post('/users')
  .send({
	"name":"sam112",
	"age":20,
	"email":"kknsanyamco@gmail.com",
	"password":"akdsafsakf"})
   .expect(201);
});

//login a user...
test("login a  user",async ()=>{
  await request(app)
  .post('/users/login')
  .send({

	"email":"sanyamco@gmail.com",
	"password":"blablabla"})
   .expect(200);
});


//login a user..
// test("should not login  a wrong user",async ()=>{
//   await request(app)
//   .post('/users/login')
//   .send({
//
// 	"email":"sanyamco@gmail.com",
// 	"password":"slfja;sfj;a"})
//    .expect(400);
// });


//getting  a user profile...
test("getting a   user profile ",async ()=>{
  await request(app)
  .get('/users/me')
  .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200);
});

//getting a user profile...
test(" should not get  a  user profile",async ()=>{
  await request(app)
  .get('/users/me')
  .send()
  .expect(401);
});

//deleting  a user ...
test("deleting  a   user profile ",async ()=>{
  await request(app)
  .delete('/users/me')
  .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200);
});

//deleting a user profile...
test("should not be deleting  a   user profile ",async ()=>{
  await request(app)
  .delete('/users/me')
  .send()
  .expect(401);
});


//uploading a avatar...
test("uploading a user aavatar " , async ()=>{
  var response = await request(app)
  .post('/users/me/avatar')
  .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
  .attach("avatar","tests/fixtures/pic.jpg")
  .expect(200);
  //console.log(response);
})


//updating usr info ...
test("updating a user info",async ()=>{
  await request(app)
  .patch('/users/me')
  .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
  .send({
	"name":"sam112",
	"age":22})
   .expect(200);
})


//updating usr info ...
test("should not updating awrong  user field info",async ()=>{
  await request(app)
  .patch('/users/me')
  .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
  .send({
	"name":"sam112",
	"wife":22})
   .expect(400);
})
