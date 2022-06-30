const jwt = require('jsonwebtoken');

//jwt secret token
JWT_TOKEN = "testing@jwt"

    const fetchuser = (req, res, next) =>{
    //Get the user from the jwt token and add id  request object
    const token = req.header('auth-token');
        if(!token){
            res.status(401).send({error: 'Please authenticate using a valid token'})
        }
        try {
            const data = jwt.verify(token, JWT_TOKEN);
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({error: 'Please authenticate using a valid token'})
        }
}

module.exports = fetchuser;