/* third party packages */
// cors error, raw node js
const cors = require('cors');
const multer = require("multer");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const User = require("./models/user");
const Resource = require("./models/resource");
const MyList = require("./models/mylist");

const userRoutes = require("./routes/user");
const resourceRoutes = require("./routes/resource");

const sequelize = require("./util/database");

// const verifyToken = require("./middlewares/authentication");

// import
const app = express();

app.use(cors());
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
    app.listen(3002);
  })
  .catch((err) => {
    console.log(err);
  });
