const JWTPayload = require("../../model/Authentication")
const Joi = require('joi');
const User = require("../../model/User");

async function Login(req,resp) {
    const {userName,password} = req.body

    const schema = Joi.object({
        userName  : Joi.string().min(3).required(),
        password  : Joi.string().min(3).required()
    })

    const {error,value} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }

    let [success,index] = User.findUser(userName)
    if(!success || User.allUsers[index].isActive == false){
        resp.status(500).send("User Does't Exists")
        return
    }
    let matchPassword = await User.allUsers[index].comparePassword(password)
    if(!matchPassword){
        resp.status(500).send("Invalid Credentials!!!")
        return
    }
    const newPayload = new JWTPayload(User.allUsers[index]);
    const newToken = newPayload.createToken();
    resp.cookie("mytoken",newToken)
    resp.status(200).send(User.allUsers[index].role);
    return 
}

module.exports = Login;