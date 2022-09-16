
function Logout(req,resp) {
    resp.cookie("mytoken",'none',{
        expires: new Date(Date.now()+ 0*1000),
    })
    resp.status(200).send("Logout Successfully");
}
module.exports =  Logout;