const Credentials = require('./Credentials');
const Tests = require('./Tests');
const Stack = require('./Stack');
const uuid = require('uuid');
const _ = require('lodash');
const bcrypt = require('bcrypt');


class User {
    static allUsers = [];
    constructor(firstName,lastName,role,credentials,experience,stack,country) {
        this.id = uuid.v4();
        this.isActive = true;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.credentials = credentials;
        this.experience = experience;
        this.stack = stack;
        this.tempStack = _.cloneDeep(stack)
        this.country = country;
        this.tests = [];
        this.outOffScore = 0;
        this.score = 0;
    }

     static async createAdmin(firstName,lastName,role,userName,password,experience,frontEnd,BackEnd,dataBase,country){
        let [success,index] = User.findUser(userName)
        if(success){
        resp.status(500).send("User already exists/ userName Taken!!!")
        return
    }
        const newCredentials = Credentials.createCredentials(userName,password);
        newCredentials.password = await newCredentials.getHashedPassword()
        const newAdmin = new User(firstName,lastName,role,newCredentials,experience,"",country);
        User.allUsers.push(newAdmin)
        return newAdmin;
    }
    async comparePassword(password)
    {
        const matchPassword = await bcrypt.compare(password,this.credentials.password);
        return matchPassword
    }

    static findUser(userName) {
        for (let index = 0; index < User.allUsers.length; index++) {
            if (User.allUsers[index].credentials.userName == userName) {
                return [true, index];
            }
        }
        return [false, -1];
    }

    findUserTest(tech) {
        for (let index = 0; index < this.tests.length; index++) {
            if (tech == this.tests[index].tech) {
                return [true, index];
            }
        }
        return [false, -1];
    }

    async createUser(firstName,lastName,role,userName,password,experience,frontEnd,BackEnd,dataBase,country) {
        const newCredentials = Credentials.createCredentials(userName, password);
        newCredentials.password = await newCredentials.getHashedPassword()
        const newStack = new Stack(frontEnd, BackEnd, dataBase);
        const newUser = new User(firstName,lastName,role,newCredentials,experience,newStack,country);
        User.allUsers.push(newUser);
        return newUser;
    }

    deleteUser(userName) {
        let [success, index] = User.findUser(userName);
        if (!success) {
            return [false, "User Doesn't Exists!!!"];
        }

        let currentUser = User.allUsers[index];
        if (currentUser.isActive == false) {
            return [false, "User Already Deleted!!!"];
        }

        currentUser.isActive = false;
        return [true, "User Deleted!!!"];
    }

    Toggle(){
        if(this.isActive == true){
            this.isActive = false
            return
        }
        this.isActive = true
        return
    }

    updateFirstName(firstName) {
        this.firstName = firstName;
    }

    updateLastName(lastName) {
        this.lastName = lastName;
    }

    

    updateUser(property, value) {
        switch (property) {
            case "firstName":
                this.updateFirstName(value);
                return true;

            case "lastName":
                this.updateLastName(value);
                return true;

            default:
                return false;
        }
    }

    getUser(userName) {
        let [success, index] = User.findUser(userName);
        if (!success) {
            return [false, "User Doesn't Exists!!!", null];
        }

        let currentUser = User.allUsers[index];
        if (currentUser.isActive == false) {
            return [false, "User Was Deleted!!!", null];
        }

        return [true, "User Fetched!!!", currentUser];
    }

    getAllUsers() {
        if (User.allUsers.length == 0) {
            return null;
        }
        return User.allUsers;
    }

    createTest(tech) {
        let [success, index] = Tests.findTest(tech);
        if (success) {
            /* test already exists */
            return [false, null];
        }
        const newTest = new Tests(tech);
        Tests.allTests.push(newTest);
        Tests.allTestsDict[tech] = newTest;
        return [true, newTest];
    }

assignTest(testName){
        for (let stackItem in this.tempStack) {
            let key = stackItem; /* key = frontend*/
            let value = this.tempStack[key]; /* value = React*/
            if(value!=null && this.isActive == true && value == testName){
            const currentTestObject = Tests.allTestsDict[value];
            if (currentTestObject != null) {
                this.tests.push(_.cloneDeep(currentTestObject))
                this.tempStack[key] = null
            } 
        }
    }
}

    getTestQuestions(tech){
        let [success,index] = this.findUserTest(tech)
        if(!success){
             return [false,-1,null]
        }
        let iterator = 0;
        let questionObject = [];
        this.tests[index].questions.forEach(element => {
            questionObject[iterator] = {
                questionNumber : iterator + 1,
                    Question       : element.details,
                    Options       : element.options
                 };
                 iterator ++
            });
            iterator = 0
            return [true,index,questionObject]
         
    }

    allTestScore(){
        let dummyScore = 0;
        let dummyOutOffScore = 0
        for (let index = 0; index < this.tests.length; index++) {
            dummyScore   += this.tests[index].score
            dummyOutOffScore += this.tests[index].outOffScore
        }
        this.score = dummyScore
        this.outOffScore = dummyOutOffScore
    }
  

}



module.exports = User



