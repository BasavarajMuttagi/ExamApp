const User = require('./model/User');
const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const  Login = require('./controller/login/controller');
const Logout  = require('./controller/logout/controller');

const {CreateUser,GetUser, GetAllUsers, DeleteUser, UpdateUser, ToggleUser, GetAllTests } = require('./controller/user/controller');
const { CreateTest, Assign, GetTest, AttemptTest, GetAllTestScores } = require('./controller/tests/controller');
const { CreateQuestion, findQuestion, DeleteQuestion } = require('./controller/questions/controller');

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())

let Admin;
async function createAd(){
  Admin = await User.createAdmin("Lewis","Hamilton","admin","Lewis123","Lewis@123",10,"","","","India")
  console.log('Admin');
}

app.post("/api/login",async(req,resp)=>Login(req,resp))

app.post("/api/logout",(req,resp)=>Logout(req,resp))

app.post("/api/createuser",async (req,resp)=>CreateUser(req,resp,Admin))

app.post("/api/getuser",(req,resp)=>GetUser(req,resp))

app.get("/api/getallusers",(req,resp)=>GetAllUsers(req,resp,Admin))

app.post("/api/deleteuser",(req,resp)=>ToggleUser(req,resp,Admin))

app.post("/api/updateuser",(req,resp)=>UpdateUser(req,resp,Admin))

app.post("/api/createtest",(req,resp)=>CreateTest(req,resp,Admin))

app.post("/api/assign",(req,resp)=>Assign(req,resp))

app.post("/api/getTest",(req,resp)=>GetTest(req,resp))

app.post("/api/attemptTest",(req,resp)=>AttemptTest(req,resp))

app.post("/api/createquestion",(req,resp)=>CreateQuestion(req,resp))

app.post("/api/findq",(req,resp)=>findQuestion(req,resp))

app.post("/api/deleteQuestion",(req,resp)=>DeleteQuestion(req,resp))

app.get("/api/getAllTests",(req,resp)=>GetAllTests(req,resp))

app.post("/api/getAllTestScores",(req,resp)=>GetAllTestScores(req,resp))

app.listen(8800,()=>{
    console.log("app is started at port 8800")
    createAd()
})