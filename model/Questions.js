

class Questions{
    static id = 3000
    static allQuestions = []
    constructor(tech,details,options,correctAnswer,complexity,Multiplier) {
        this.id = Questions.id++
        this.tech = tech
        this.details = details
        this.options = options
        this.selectedAnswer = ''
        this.correctAnswer = correctAnswer
        this.complexity = complexity
        this.score = 0
        this.outOffMark = complexity * Multiplier
        this.negativeMark = 0
        this.isActive = true
    }

    selectOption(answer){
        this.selectedAnswer = answer
        if(this.selectedAnswer == this.correctAnswer){
            this.score = this.outOffMark
            this.negativeMark = 0 
        }
        
        if(this.selectedAnswer != this.correctAnswer){
            this.score = 0
            this.negativeMark = - 0.25 * this.outOffMark
        }
    }

    deleteQuestion(){
        this.isActive = false
    }

}

module.exports = Questions