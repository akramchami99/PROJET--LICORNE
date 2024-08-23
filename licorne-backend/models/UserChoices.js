const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Unicorn = require('../models/Unicorn');    
const Scenario = require('../models/Scenario');  
const Choice = require('../models/Choice');  

const UserChoices = sequelize.define('UserChoices', {
  outcome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Unicorn.hasMany(UserChoices, {foreignKey: "unicornId"});
UserChoices.belongsTo(Unicorn, {foreignKey: "unicornId"});

Scenario.hasMany(UserChoices, {foreignKey: "scenarioId"});
UserChoices.belongsTo(Scenario, {foreignKey: "scenarioId"});

Choice.hasMany(UserChoices, {foreignKey: "choiceId"});
UserChoices.belongsTo(Choice, {foreignKey: "choiceId"});


module.exports = UserChoices;

