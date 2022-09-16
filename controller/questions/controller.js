const JWTPayload = require("../../model/Authentication")
const Joi = require('joi');
const Tests = require("../../model/Tests");
function CreateQuestion(req,resp){
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "admin")
    {
        resp.status(504).send("Please Login As Admin!!!")
        return;
    }

    // const schema = Joi.object({
    //     tech :Joi.string().min(3).required(),
    //     details :Joi.string().min(3).required(),
    //     options :Joi.string().min(3).required(),
    //     correctAnswer :Joi.string().min(1).required(),
    //     complexity :Joi.number().min(1).required()
    // })

    // const {error,value} = schema.validate(req.body)
    // if(error){
    //     resp.status(400).send(error.details[0].message);
    //     return;
    // }
    
    const {tech,details,options,correctAnswer,complexity} = req.body
    const questionObject = Tests.createQuestion(tech,details,options,correctAnswer,complexity)
    
    resp.status(200).send(questionObject)
    return
}
function findQuestion(req,resp){
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "admin")
    {
        resp.status(504).send("Please Login As Admin!!!")
        return;
    }

   

    const {questionID,tech} = req.body
    const index = Tests.findQuestion(questionID,tech)
    if(index == -1){
        resp.status(400).send("Question Not Found!!!")
        return
    }
    resp.status(200).send(Tests.allTestsDict[tech].questions[index])
    return
}
function DeleteQuestion(req,resp){
    let newPayload = JWTPayload.isValidateToken(req, resp, req.cookies["mytoken"]);
    if(newPayload.role != "admin")
    {
        resp.status(504).send("Please Login As Admin!!!")
        return;
    }

   

    const {questionID,tech} = req.body
    const index = Tests.findQuestion(questionID,tech)
    if(index == -1){
        resp.status(400).send("Question Not Found!!!")
        return
    }
    const currentQuestion = Tests.allTestsDict[tech].questions[index]
    currentQuestion.deleteQuestion()
    resp.status(200).send("Question Deleted!!!")
    return
}

module.exports = {CreateQuestion,findQuestion,DeleteQuestion}