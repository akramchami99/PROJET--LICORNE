const { Sequelize } = require('sequelize');
require('dotenv').config(); // To use .env file for sensitive data

const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database user
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host
    dialect: 'mysql',
  }
);

module.exports = sequelize;
