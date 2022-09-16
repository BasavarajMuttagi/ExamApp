const Questions = require('./Questions');

class Tests{
    static id = 2000
     
    static allTests = []
    static allTestsDict = {}
    constructor(tech){
        this.id = Tests.id++
        this.tech = tech
        this.questions = []
        this.score = 0
        this.outOffScore = 0
        this.isAttempted = false
    }

    static findTest(tech){
        for (let index = 0; index < Tests.allTests.length; index++) {
            if(Tests.allTests[index].tech == tech){
                return [true,index]
            }
        }
        return [false,-1]
    }

    static createQuestion(tech,details,options,correctAnswer,complexity){
        let Multiplier  = 100
        const newQuestion = new Questions(tech,details,options,correctAnswer,complexity,Multiplier)
        Questions.allQuestions.push(newQuestion);
        
        
        let [success,index] = Tests.findTest(tech)
        if(!success){
            const newTest = new Tests(tech);
            Tests.allTests.push(newTest)
            Tests.allTestsDict[tech] = newTest
            newTest.questions.push(newQuestion)
            newTest.outOffScore += newQuestion.complexity * Multiplier
            return newQuestion
        }
        
        const currentTest = Tests.allTests[index]
        currentTest.questions.push(newQuestion)
        currentTest.outOffScore+= newQuestion.complexity * Multiplier
        return newQuestion

    }

    totalTestScore(){
        for (let index = 0; index < this.questions.length; index++) {
            this.score += this.questions[index].score + this.questions[index].negativeMark
        }
    }

    static findQuestion(questionID,tech){
        const currentTest = Tests.allTestsDict[tech]
        const questionsInTest = currentTest.questions
        for (let index = 0; index < questionsInTest.length; index++) {
            const eachQuestion = questionsInTest[index];
            if(eachQuestion.id == questionID){
                return index
            }
        }
        return -1
    }
    

}

module.exports = Tests