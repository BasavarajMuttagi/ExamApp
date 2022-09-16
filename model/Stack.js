class Stack{
    constructor(frontEnd,BackEnd,dataBase){
       this.frontEnd=frontEnd
       this.BackEnd=BackEnd
       this.dataBase=dataBase
    }
    createStack(frontEnd,BackEnd,dataBase){
       const  newStack = new Stack(frontEnd,BackEnd,dataBase)
       return newStack
    }
}
module.exports = Stack