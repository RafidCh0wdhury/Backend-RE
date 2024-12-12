const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

dotenv.config();

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return res
      .status(401)
      .send({ message: "User with this email does not exist." });
  }

  const isAuthenticated = await bcrypt.compare(password, user.password);

  if (!isAuthenticated) {
    return res.status(401).send({ message: "Password is incorrect" });
  }

  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 5,
  });

  return res.send({
    id: user.id,
    name: user.name,
    email: user.email,
    major: user.major,
    access_token: accessToken,
  });
};

exports.signup = async (req, res, next) => {
  const { email, password, name, major } = req.body;
  const existingUser = await User.findOne({
    where: {
      email,
    },
  });
  if (existingUser) {
    return res
      .send({ message: "User with this email is already signed up." })
      .status(406);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!hashedPassword) {
    return res
      .send("Something went wrong while saving password to database.")
      .status(500); //500 internet server error
  }
  const newUser = await User.create({
    email,
    password: hashedPassword,
    name,
    major,
  });

  if (newUser) {
    return res.send({ message: "User created successfully." }).status(200);
  } else {
    return res.send({ message: "User couldn't be created." }).status(400);
  }
};

exports.fetchUserPassword = async (req, res, next) => {
  const { id } = req.params;

  User.findOne({
    where: {
      id,
    },
    attributes: ["password"],
  });
};