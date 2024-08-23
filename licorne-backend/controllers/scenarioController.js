const  Scenario  = require('../models/Scenario');

const getScenario = async (req, res) => {
  try {
  
    // Fetch the next scenario based on the unicorn's current progress
    const scenario = await Scenario.findAll();

    if (!scenario) {
      return res.status(404).json({ message: 'No scenario found' });
    }

    res.json({ scenario });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scenario', error });
  }
};


module.exports = { getScenario };
