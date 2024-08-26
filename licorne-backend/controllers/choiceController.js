const Unicorn = require('../models/Unicorn');
const Choice = require('../models/Choice');
const UserChoices = require('../models/UserChoices');
const Scenario = require('../models/Scenario');

// Fetch Choices for a Scenario and Step
const getChoices = async (req, res) => {
  const { scenarioId, step } = req.body; // Destructure scenarioId and step from the request body

  try {
    const choices = await Choice.findAll({ where: { ScenarioId: scenarioId, step: step } }); // Query by ScenarioId and step

    if (!choices || choices.length === 0) {
      return res.status(404).json({ message: 'No choices found for this step.' });
    }

    res.json(choices); // Return the choices array
  } catch (error) {
    console.error('Error fetching choices:', error);
    res.status(500).json({ message: 'Error fetching choices', error });
  }
};

// Get Choices for a Specific Scenario
const getChoicesForScenario = async (req, res) => {
  const { id } = req.params; // The scenario ID

  try {
    // Find the scenario by ID and include the related choices
    const scenario = await Scenario.findOne({
      where: { id },
      include: [
        {
          model: Choice,
          where: { ScenarioId: id },
          required: false, // Set this to false in case no choices exist
        },
      ],
    });

    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    // Send back the scenario with associated choices
    res.json({
      scenarioId: scenario.id,
      description: scenario.description,
      level: scenario.level,
      choices: scenario.Choices, // Assuming Choices is the name of the association
    });
  } catch (error) {
    console.error('Error fetching scenario choices:', error);
    res.status(500).json({ message: 'Error fetching scenario choices', error });
  }
};



// Submit a Choice and Process the Outcome
const submitChoice = async (req, res) => {
  const { userId, unicornId, choiceId, scenarioId } = req.body; // Extract unicornId, choiceId, scenarioId from the request body

  try {
    // Find the unicorn, choice, and scenario
    const unicorn = await Unicorn.findOne({ where: { id: unicornId, userId } });
    const choice = await Choice.findOne({ where: { id: choiceId } });
    const scenario = await Scenario.findOne({ where: { id: scenarioId } });

    if (!unicorn || !choice || !scenario) {
      return res.status(404).json({ message: 'Unicorn, choice, or scenario not found' });
    }

    // Check unicorn's attribute points against choice's required points
    const attributeValue = unicorn[choice.required_attribute];
    let outcome = 'failure'; // Default to failure

    // Determine success or failure based on the unicorn's attribute points
    if (attributeValue >= choice.required_points) {
      outcome = 'success';

      // Add points to the unicorn's available stats (e.g., give a bonus point to distribute)
      const newPointsAvailable = 1; 

      // Log the choice in user_choices table
      await UserChoices.create({
        unicornId: unicorn.id,
        scenarioId: scenario.id,
        choiceId: choice.id,
        outcome,
      });
      // Return success with the next step and updated points
      return res.json({
        outcome,
        newHealth: unicorn.health,
        newPointsAvailable,
      });
    } else {
      // On failure, reduce health
      unicorn.health -= 2;
      await unicorn.save();

      if (unicorn.health <= 0) {
        return res.json({ outcome: 'game-over', message: 'Your unicorn has perished.' });
      }

      // Log the choice in user_choices table
      await UserChoices.create({
        unicornId: unicorn.id,
        ScenarioId: scenario.id,
        ChoiceId: choice.id,
        outcome,
      });

      // Return failure
      return res.json({
        outcome,
        currentHealth: unicorn.health,
      });
    }
  } catch (error) {
    console.error('Error submitting choice:', error);
    return res.status(500).json({ message: 'Error submitting choice', error: error.message });
  }
};

module.exports = { getChoices, submitChoice, getChoicesForScenario };
