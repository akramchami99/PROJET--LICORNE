const  Scenario  = require('../models/Scenario');
const Choice = require('../models/Choice')

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

// Create Scenario
const createScenario= async (req, res) => {
  const { description, level, steps } = req.body;
  try {
    const newScenario = await Scenario.create({ description, level });
    
    // Loop through steps and create choices
    for (const step of steps) {
      for (const choice of step.choices) {
        await Choice.create({
          text: choice.text,
          required_attribute: choice.requiredAttribute,
          required_points: choice.requiredPoints,
          outcome_success: choice.outcomeSuccess,
          outcome_failure: choice.outcomeFailure,
          step: step.id,
          ScenarioId: newScenario.id,
        });
      }
    }
    
    res.json({ message: 'Scenario created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating scenario', error });
  }
};


// Update Scenario
const updateScenario = async (req, res) => {
  const { id } = req.params;
  const { description, level, steps } = req.body;

  try {
    // Update scenario details
    const scenario = await Scenario.findByPk(id);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });

    await scenario.update({ description, level });

    // Delete old choices
    await Choice.destroy({ where: { ScenarioId: id } });

    // Add new choices
    for (const step of steps) {
      for (const choice of step.choices) {
        await Choice.create({
          text: choice.text,
          required_attribute: choice.requiredAttribute,
          required_points: choice.requiredPoints,
          outcome_success: choice.outcomeSuccess,
          outcome_failure: choice.outcomeFailure,
          step: step.id,
          ScenarioId: id,
        });
      }
    }

    res.json({ message: 'Scenario updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating scenario', error });
  }
};

// Delete Scenario
const deleteScenario = async (req, res) => {
  const { id } = req.params;
  try {
    const scenario = await Scenario.findByPk(id);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });

    await scenario.destroy();
    res.json({ message: 'Scenario deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting scenario', error });
  }
};

module.exports = { getScenario, createScenario, updateScenario, deleteScenario};
