const jwt = require("jsonwebtoken");

/**
 * middleware for advance route example: getOrder, getcustomer
 * get token for new secret enveronments
 */
const verifyTokenAndAuthorization = (req, res, next) => {
   const advanceAuthentication = req.headers.token;

   if (advanceAuthentication) {
      const token = advanceAuthentication.split(" ")[1];
      jwt.verify(token, process.env.SECRET, (err, user) => {
         if (err) res.status(400).json("authorization failed!");

         req.user = user;
         next();
      });
   } else {
      return res
         .status(500)
         .json({ message: "advance authentication failed!" });
   }
};

module.exports = { verifyTokenAndAuthorization };
