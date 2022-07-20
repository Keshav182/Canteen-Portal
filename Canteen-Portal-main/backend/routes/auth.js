const jwt = require('jsonwebtoken');

function auth (req, res, next){
    try{
        // console.log(req.headers);
        const token = req.headers["token"];
        if(!token || !jwt.verify(token, "abrakadabra")){
            return res.status(401).json({
                error: "Authorisation denied"
            });
        }
        else{
            req.user = jwt.verify(token, "abrakadabra");
            // console.log("Verified");
            next();
        }
    }
    catch(err){
        res.status(500).json({
            error: err
        });
        // console.log(err);
    }
}

module.exports = auth;