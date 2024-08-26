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

const createScenario = async (req, res) => {
  const { description, level, steps } = req.body;

  try {
    // First, create the scenario
    const newScenario = await Scenario.create({ description, level });
    
    // Prepare an array to hold the created choices
    const createdChoices = [];

    // Loop through steps and create choices
    for (const stepIndex in steps) {
      const step = steps[stepIndex];
      const stepId = parseInt(stepIndex) + 1; // Steps go from 1 to 3 (increment by 1)

      console.log(`Processing step: ${stepId}`);  // Log the step being processed
      
      for (const choice of step.choices) {
        console.log(`Creating choice for step ${stepId}: ${choice.text}`);
        
        const createdChoice = await Choice.create({
          text: choice.text,
          required_attribute: choice.requiredAttribute,
          required_points: choice.requiredPoints,
          outcome_success: choice.outcomeSuccess,
          outcome_failure: choice.outcomeFailure,
          step: stepId, // Assign the step number (from 1 to 3)
          ScenarioId: newScenario.id, // Link the choice to the scenario
        });

        // Add created choice to the array for response
        createdChoices.push(createdChoice);
      }
    }

    // Send back the new scenario and its created choices
    res.json({
      message: 'Scenario created successfully!',
      scenario: newScenario,
      choices: createdChoices, // Include the choices in the response
    });
  } catch (error) {
    console.error('Error creating scenario:', error);
    res.status(500).json({ message: 'Error creating scenario', error });
  }
};



// Update Scenario
const updateScenario = async (req, res) => {
  const { id } = req.params; // The scenario ID
  const { description, level, steps } = req.body; // The updated data from the frontend

  try {
    // Find the scenario to ensure it exists
    const scenario = await Scenario.findOne({ where: { id } });

    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    // Update the scenario's description and level
    scenario.description = description;
    scenario.level = level;
    await scenario.save();

    // Loop through each step and update or create choices
    for (const stepIndex in steps) {
      const step = steps[stepIndex];
      const stepId = parseInt(stepIndex) + 1; // Steps go from 1 to 3

      for (const choice of step.choices) {
        if (choice.id) {
          // If the choice already has an ID, update the existing choice
          const existingChoice = await Choice.findOne({ where: { id: choice.id, ScenarioId: id } });
          if (existingChoice) {
            existingChoice.text = choice.text;
            existingChoice.required_attribute = choice.requiredAttribute;
            existingChoice.required_points = choice.requiredPoints;
            existingChoice.outcome_success = choice.outcomeSuccess;
            existingChoice.outcome_failure = choice.outcomeFailure;
            existingChoice.step = stepId;
            await existingChoice.save(); // Save the updated choice
          }
        } else {
          // If no choice ID, create a new choice for this step
          await Choice.create({
            text: choice.text,
            required_attribute: choice.requiredAttribute,
            required_points: choice.requiredPoints,
            outcome_success: choice.outcomeSuccess,
            outcome_failure: choice.outcomeFailure,
            step: stepId,
            ScenarioId: id,
          });
        }
      }
    }

    res.json({ message: 'Scenario and choices updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating scenario and choices', error });
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
