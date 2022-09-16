const JWT = require("jsonwebtoken")
const Credentials = require("./Credentials")
class JWTPayload{
    static secretKey = "stillWeRise";
    constructor(user){
        this.role = user.role
        this.userName = user.credentials.userName
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.experience = user.experience
    }
    createToken()
    {
        return JWT.sign(JSON.stringify(this),JWTPayload.secretKey)
    }

    static verifyCookie(token)
    {
        return JWT.verify(token,JWTPayload.secretKey)
    }

    static isValidateToken(req, resp, myToken) {
        if (!myToken) {
            return false
        }
        return JWTPayload.verifyCookie(myToken)
    }


}

module.exports = JWTPayload;