const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Resource = sequelize.define("resources", {
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
  resourceName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  resourceClass: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  resourcePath: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tags: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  uploadedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = Resource;