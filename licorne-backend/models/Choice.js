const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Scenario = require('../models/Scenario');

const Choice = sequelize.define('Choice', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  required_attribute: {
    type: DataTypes.STRING, // force, intelligence, or esquive
    allowNull: false,
  },
  required_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  outcome_success: {
    type: DataTypes.TEXT, // Description of success outcome
    allowNull: true,
  },
  outcome_failure: {
    type: DataTypes.TEXT, // Description of failure outcome
    allowNull: true,
  },
  step:{
    type: DataTypes.TEXT,
    allowNull:false,
  }
});

Scenario.hasMany(Choice);
Choice.belongsTo(Scenario);

module.exports = Choice;
