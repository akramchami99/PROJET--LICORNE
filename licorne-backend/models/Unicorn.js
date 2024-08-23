const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('../models/User');

const Unicorn = sequelize.define('Unicorn', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  force: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  intelligence: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  esquive: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  health: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  currentScenario: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  currentStep: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

User.hasMany(Unicorn)
Unicorn.belongsTo(User)

module.exports = Unicorn;
