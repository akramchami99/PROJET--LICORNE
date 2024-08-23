const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Scenario = sequelize.define('Scenario', {
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER, // 1 = Palier 1, 2 = Palier 2, 3 = Palier 3
    allowNull: false,
  },
});

module.exports = Scenario;
