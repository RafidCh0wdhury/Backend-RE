/* third party packages */
// cors error, raw node js
const multer = require("multer");
const multerS3 = require("multer-s3");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const aws = require('aws-sdk');
const User = require("./models/user");
const Resource = require("./models/resource");
const MyList = require("./models/mylist");
const userRoutes = require("./routes/user");
const resourceRoutes = require("./routes/resource");
const sequelize = require("./util/database");


//
require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Replace with your RDS endpoint
  user: process.env.DB_USER,  // Replace with your DB username
  password: process.env.DB_PASS, // Replace with your DB password
  database: process.env.DB_NAME,  // Replace with your DB name
  port: 3306  // Default MySQL port
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

module.exports = connection;


// const verifyToken = require("./middlewares/authentication");

// import
const app = express();
app.set("trust proxy", true);
const cors = require('cors');
app.use(cors({
    origin: 'https://resourcexchange.net', // Or use '*' for all origins (but this is not recommended in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies to be sent across domains if needed
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 }));

// app.use(verifyToken())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(userRoutes);
app.use(resourceRoutes);

User.hasMany(Resource, { foreignKey: "userId" });
Resource.belongsTo(User, { foreignKey: "userId" });

User.hasMany(MyList, { foreignKey: "userId" });
MyList.belongsTo(User, { foreignKey: "userId" });

Resource.hasMany(MyList, { foreignKey: "resourceId" });
MyList.belongsTo(Resource, { foreignKey: "resourceId" });

sequelize
  .sync()
  .then((data) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
