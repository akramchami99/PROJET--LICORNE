const Unicorn = require('../models/Unicorn');

// Create Character
const createCharacter = async (req, res) => {
  const { name, force, intelligence, esquive, userId } = req.body;
  console.log(name, force, intelligence, esquive, userId);

  // Validate input
  if (!name || force === undefined || intelligence === undefined || esquive === undefined || !userId) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  // Ensure the total points allocated don't exceed 5
  const totalPoints = force + intelligence + esquive;
  if (totalPoints > 5) {
    return res.status(400).json({ message: 'You can only allocate 5 points in total' });
  }

  try {
    const newUnicorn = await Unicorn.create({
      name,
      force,
      intelligence,
      esquive,
      health: 10, // Starting health
      currentScenario: 0, // Start at the first scenario
      UserId: userId,
    });
    res.json({ message: 'Character created successfully', unicorn: newUnicorn });
  } catch (error) {
    res.status(500).json({ message: 'Error creating character', error });
  }
};

// Get Unicorn by userId
const getUnicorn = async (req, res) => {
  const { userId } = req.body;
  try {
    const unicorn = await Unicorn.findAll({ where: { userId } });
    if (unicorn) {
      return res.json({ unicorn });
    } else {
      return res.json({ message: 'No unicorn found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching unicorn', error });
  }
};

// Assign points to a chosen attribute
const assignPoint = async (req, res) => {
  const { unicornId, attribute } = req.body;

  if (!unicornId || !attribute) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const validAttributes = ['force', 'intelligence', 'esquive'];
  if (!validAttributes.includes(attribute)) {
    return res.status(400).json({ message: 'Invalid attribute. Choose between force, intelligence, or esquive.' });
  }

  try {
    const unicorn = await Unicorn.findOne({ where: { id: unicornId } });
    if (!unicorn) {
      return res.status(404).json({ message: 'Unicorn not found' });
    }

    unicorn[attribute] += 1;
    await unicorn.save(); // Save the updated unicorn

    res.json({ message: `Point assigned to ${attribute}.`, unicorn });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning point to attribute', error });
  }
};

// Update Unicorn's Current Scenario
const updateCurrentScenario = async (req, res) => {
  const { unicornId, scenarioId } = req.body;

  if (!unicornId || !scenarioId) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const unicorn = await Unicorn.findOne({ where: { id: unicornId } });
    if (!unicorn) {
      return res.status(404).json({ message: 'Unicorn not found' });
    }

    unicorn.currentScenario = scenarioId;
    unicorn.currentStep = 1; // Reset to step 1 when starting a new scenario
    await unicorn.save();

    res.json({ message: 'Current scenario updated successfully', unicorn });
  } catch (error) {
    res.status(500).json({ message: 'Error updating current scenario', error });
  }
};

// Update Unicorn's Current Step
const updateCurrentStep = async (req, res) => {
  const { unicornId, step } = req.body;

  if (!unicornId || step === undefined) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const unicorn = await Unicorn.findOne({ where: { id: unicornId } });
    if (!unicorn) {
      return res.status(404).json({ message: 'Unicorn not found' });
    }

    unicorn.currentStep = step;
    await unicorn.save();

    res.json({ message: 'Current step updated successfully', unicorn });
  } catch (error) {
    res.status(500).json({ message: 'Error updating current step', error });
  }
};

module.exports = {
  createCharacter,
  getUnicorn,
  assignPoint,
  updateCurrentScenario,
  updateCurrentStep,
};
