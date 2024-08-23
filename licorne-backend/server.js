// server.js
const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db'); // Sequelize DB connection
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const characterRoutes = require('./routes/characterRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const choiceRoutes = require('./routes/choiceRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cors())
// Routes
app.use('/api', authRoutes);
app.use('/api', characterRoutes);
app.use('/api', scenarioRoutes);
app.use('/api', choiceRoutes);

// Start the server and sync the DB
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
