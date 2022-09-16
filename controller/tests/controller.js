const JWTPayload = require("../../model/Authentication")
const Joi = require('joi');
const User = require("../../model/User");

function CreateTest(req,resp,Admin) {

    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "admin")
    {
        resp.status(504).send("Please Login As Admin!!!")
        return;
    }
    const schema = Joi.object({
        tech  : Joi.string().min(3).required(),
    })

    const {error,values} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }

    const {tech} = req.body
    const [success,testObject] = Admin.createTest(tech)

    if(!success){
        resp.status(200).send("test already exists!")
        return
    }
    resp.status(200).send("Test Created!!!")
    return
}

function Assign(req,resp){
    

    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "admin")
    {
        resp.status(504).send("Please Login As Admin!!!")
        return;
    }
    const schema = Joi.object({
        userName :  Joi.string().min(4).required(),
    })

    const {error,value} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }

    const {userName} = req.body
    let [success,index] = User.findUser(userName)
    if(!success || User.allUsers[index].isActive == false){
        resp.status(500).send("User Does't Exists")
        return
    }
    const currentUser = User.allUsers[index]
    currentUser.assignTest()
    resp.status(200).send("Test Assigned!!")
    return
}

function GetTest(req,resp) {
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "user")
    {
        resp.status(504).send("Please Login As User!!!")
        return;
    }
   const schema = Joi.object({
        userName :  Joi.string().min(4).required(),
        tech :  Joi.string().min(3).required()
    })

    const {error,value} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }

    const {userName,tech} = req.body
    let [success,index] = User.findUser(userName)
    if(!success || User.allUsers[index].isActive == false){
        resp.status(500).send("User Does't Exists")
        return
    }
    const currentUser = User.allUsers[index]
    currentUser.assignTest(tech)
    currentUser.allTestScore()

    const [findTestSuccess,testIndex,testObject] = currentUser.getTestQuestions(tech)
    if(!findTestSuccess){
        resp.status(500).send(`Test Not Assigned for ${tech}`)
        return
    }
    resp.status(200).send(testObject)
    return
}

function AttemptTest(req,resp){
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "user")
    {
        resp.status(504).send("Please Login As User!!!")
        return;
    }

    const schema = Joi.object({
        userName :  Joi.string().min(4).required(),
        tech :  Joi.string().min(3).required(),
        answerArray :Joi.array().items(Joi.string()).required()
    })

    const {error,value} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }

    const {userName,tech,answerArray} = req.body
    let [success,indexs] = User.findUser(userName)
    if(!success || User.allUsers[indexs].isActive == false){
        resp.status(500).send("User Does't Exists")
        return
    }
    const currentUser = User.allUsers[indexs]

   
    let [findUserTestSuccess,testIndex] = currentUser.findUserTest(tech)
    if(!findUserTestSuccess){
        resp.status(500).send(`Test Not Assigned for ${tech}`)
        return
    }

    const currentTest = currentUser.tests[testIndex]
    if(currentTest.isAttempted == true){
        resp.status(403).send("Test Already Attempted!!!")
        return
        
    }

    let testlength = currentTest.questions.length;
    for (let index = 0; index < testlength; index++) {
        let currentAnswer = answerArray[index];
        let eachQuestion = currentTest.questions[index]
           eachQuestion.selectOption(currentAnswer)
           
    }
    currentTest.isAttempted = true
    currentTest.totalTestScore()
    currentUser.allTestScore()
    resp.status(200).send(currentTest)
    return
}

function GetAllTestScores(req,resp) {
    const {userName} = req.body
    console.log(req.body);
    let [success,indexs] = User.findUser(userName)
    if(!success){
        resp.status(500).send("User Does't Exists")
        return
    }
    const currentUser = User.allUsers[indexs]
    resp.status(200).send(currentUser.tests)
    return

}



module.exports = {CreateTest,Assign,GetTest,AttemptTest,GetAllTestScores}