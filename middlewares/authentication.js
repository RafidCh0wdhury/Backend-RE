const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = (req, res, next) => {
  if (req.url === "/login" || req.url === "/signup" || req.url === "/logout") {
    return next();
  }

  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { email } = decoded;

    User.findAll({
      where: {
        email: email,
      },
    })
      .then((user) => {
        req.user = user[0];
        next();
      })
      .catch((err) =>
        res.send({ message: "User not found in database." }).status(404)
      );
  } catch (err) {
    console.log("error");
    return res.send({ message: "Unauthorized access" }).status(401);
  }
};

module.exports = verifyToken;
