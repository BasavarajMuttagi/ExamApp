const bcrypt = require('bcrypt');

class Credentials{
    static allCredentials = []
    constructor(userName,password) {
        this.userName = userName
        this.password = password
    }

    async getHashedPassword(){
        return bcrypt.hash(this.password,10);
    }

    static createCredentials(userName,password){
        const newCredentials = new Credentials(userName,password);
        Credentials.allCredentials.push(newCredentials)
        return newCredentials
    }
}

module.exports = Credentials