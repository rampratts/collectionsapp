const { TokenPrefix } = require('../keys');

const authRequired = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if(bearerHeader !== undefined){
        const bearer = bearerHeader.split(" ");
        
        if(bearer[0] !== TokenPrefix){
            res.sendStatus(401);
        } else {
            const bearerToken = bearer[0];

            req.token = bearerToken;
            next();
        }
    } else {
        res.sendStatus(401);
    }
}

module.exports = authRequired;