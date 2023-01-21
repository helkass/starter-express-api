const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next)=> {
    const header = req.headers.token

    if(header){
        const token = header.split(" ")[1]
        jwt.verify(token, process.env.SECRET, (err, admin) =>{
            if(err) res.status(400).json(err.message);

            req.admin = admin;
            next();
        })
    }else{
        return res.status(500).json({message: "authentications failed!"})
    }
}

module.exports = {verifyToken};