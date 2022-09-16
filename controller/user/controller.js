const JWTPayload = require("../../model/Authentication")
const Joi = require('joi');
const User = require("../../model/User");
const Tests = require("../../model/Tests");

async function CreateUser(req,resp,Admin) {
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);

    if(newPayload.role != "admin")
    {
        resp.status(504).send("Please Login As Admin!!!")
        return;
    }

    const schema = Joi.object({
        firstName : Joi.string().min(3).required(),
        lastName :  Joi.string().min(3).required(),
        role :      Joi.string().min(4).required(),
        userName :  Joi.string().min(4).required(),
        password :  Joi.string().min(4).required(),
        experience : Joi.number().min(0).required(),
        frontEnd : Joi.string().min(3).required(),
        BackEnd : Joi.string().min(3).required(),
        dataBase : Joi.string().min(3).required(),
        country : Joi.string().min(4).required()
    })

    const {error,value} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }
    const {firstName,lastName,role,userName,password,experience,frontEnd,BackEnd,dataBase,country} = req.body
    const [success,index] = User.findUser(userName)
    if(success){
        resp.status(400).send("User Already Exists!!!")
        return
    }
    const newUser = await Admin.createUser(firstName,lastName,role,userName,password,experience,frontEnd,BackEnd,dataBase,country)
    
    // newUser.assignTest()
    // newUser.allTestScore()
    resp.status(200).send("User")
    return
}

function GetUser(req,resp) {
    
    // let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    // if(newPayload.role != "admin")
    // {
    //     resp.status(504).send("Please Login As Admin!!!")
    //     return;
    // }

    // const schema = Joi.object({
    //     userName :  Joi.string().min(4).required(),
    // })

    // const {error,value} = schema.validate(req.body)
    // if(error){
    //     resp.status(400).send(error.details[0].message);
    //     return;
    // }

    const {userName} = req.body
    console.log(userName);
    let [success,index] = User.findUser(userName)

    if(!success ){
        resp.status(500).send("User Does't Exists")
        return
    }
    
    const currentUser = User.allUsers[index]
    resp.status(200).send([currentUser.stack,currentUser.tempStack])
    return
}

function GetAllUsers(req,resp,Admin){
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "admin")
    {
        resp.status(504).send("Please Login As Admin!!!")
        return;
    }
    const allUsers = Admin.getAllUsers()
    resp.status(200).send(allUsers)
    return
}

function DeleteUser(req,resp,Admin){
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
    const [success,text] = Admin.deleteUser(userName)
    resp.status(200).send(text)
    return
}

function ToggleUser(req,resp,Admin){
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

    let currentUser = User.allUsers[index]
    if(currentUser.isActive == true){
        currentUser.isActive = false
        console.log();
        resp.status(200).send("toggled to false!!!")
        return
    }
    currentUser.isActive = true
    resp.status(200).send("toggled to true!!!")
    return
}

function UpdateUser(req,resp){  
    

    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "admin")
    {
        resp.status(504).send("Please Login As Admin!!!")
        return;
    }

    const schema = Joi.object({
        userName  : Joi.string().min(4).required(),
        property : Joi.string().min(8).required(),
        value  : Joi.string().min(3).required()
    })
    const {error,values} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }

    const {userName,property,value} = req.body
    let [success,index] = User.findUser(userName)
    if(!success || User.allUsers[index].isActive == false){
        resp.status(500).send("User doesn't exists!!!")
        return
    }
    const currentUser = User.allUsers[index]
    currentUser.updateUser(property,value)
    resp.status(200).send(currentUser)
    return
}

function GetAllTests(req,resp) {
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "admin")
    {
        resp.status(504).send("Please Login As Admin!!!")
        return;
    }

    if(Tests.allTests.length == 0){
        resp.status(400).send("No Tests Available")
        return 
    }
    resp.status(200).send(Tests.allTests)
    return
}




module.exports =  {CreateUser,GetUser,GetAllUsers,DeleteUser,UpdateUser,ToggleUser,GetAllTests};
