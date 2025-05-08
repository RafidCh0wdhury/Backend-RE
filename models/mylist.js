const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const MyList = sequelize.define("mylist", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  resourceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "resources",
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

module.exports = MyList;
