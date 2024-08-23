import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function GameplayPage() {
  const [unicorns, setUnicorns] = useState([]);
  const [unicorn, setUnicorn] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [completedScenarios, setCompletedScenarios] = useState([]); // Track completed scenarios
  const [choices, setChoices] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [command, setCommand] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate()

  // Fetch unicorns when the component mounts
  useEffect(() => {
    const fetchUnicorns = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/get-unicorn', { userId });
        if (response.data.unicorn && response.data.unicorn.length > 0) {
          setUnicorns(response.data.unicorn);
          response.data.unicorn.forEach((u) => {
            appendToConsole(
              `Unicorn ID: ${u.id}, Name: ${u.name}, Force: ${u.force}, Intelligence: ${u.intelligence}, Esquive: ${u.esquive}`
            );
          });
          appendToConsole('Choose a unicorn using: play <unicornId>');
        } else {
          appendToConsole('No unicorn found. Please create one using: create <name> <force> <intelligence> <esquive>');
        }
      } catch (error) {
        appendToConsole('Error fetching unicorns.');
      }
    };

    fetchUnicorns();
  }, [userId]);

  // Create a new unicorn
  const createCharacter = async (name, force, intelligence, esquive) => {
    try {
      const response = await axios.post('http://localhost:3000/api/create-character', {
        name,
        force,
        intelligence,
        esquive,
        userId,
      });

      const newUnicorn = response.data.unicorn;
      setUnicorns((prevUnicorns) => [...prevUnicorns, newUnicorn]);
      setUnicorn(newUnicorn); // Set the newly created unicorn as selected
      appendToConsole(`Unicorn "${newUnicorn.name}" created. Choose a scenario using: select <scenarioId>`);
      fetchScenarios(); // Fetch scenarios after creating the unicorn
    } catch (error) {
      appendToConsole('Error creating unicorn.');
    }
  };

  // Fetch all available scenarios
  const fetchScenarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/get-scenario');
      if (response.data.scenario && response.data.scenario.length > 0) {
        setScenarios(response.data.scenario);
        response.data.scenario.forEach((s) => {
          appendToConsole(`Scenario ID: ${s.id} | ${s.description}`);
        });
        appendToConsole('Choose a scenario using: select <scenarioId>');
      } else {
        appendToConsole('No scenarios available.');
      }
    } catch (error) {
      appendToConsole('Error fetching scenarios.');
    }
  };

  // Fetch choices for a specific step of the selected scenario
  const fetchChoicesForStep = async (scenarioId, step) => {
    try {
      const response = await axios.post('http://localhost:3000/api/get-choices', { scenarioId, step });
      if (response.data.length > 0) {
        setChoices(response.data);
        response.data.forEach((c) => {
          appendToConsole(`Choice ID: ${c.id} | ${c.text} | Required Attribute: ${c.required_attribute} | Required Points: ${c.required_points}`);
        });
        appendToConsole('Choose an option using: choose <choiceId>');
      } else {
        appendToConsole('No choices available for this step.');
      }
    } catch (error) {
      appendToConsole('Error fetching choices.');
    }
  };

  // Handle choice submission
  const submitChoice = async (choiceId) => {
    try {
      const response = await axios.post('http://localhost:3000/api/submit-choice', {
        userId,
        unicornId: unicorn.id,
        choiceId,
        scenarioId: selectedScenario,
      });

      const { outcome, currentHealth, newPointsAvailable } = response.data;

      appendToConsole(`Outcome: ${outcome}`);
      if (outcome === 'success') {
        appendToConsole(`Success! You have ${newPointsAvailable} points to assign. Use: assign <attribute>`);

        // Move to the next step
        const nextStep = currentStep + 1;

        if (nextStep > 3) {
          // Scenario completed after 3 steps
          appendToConsole(`Well done! You've completed Scenario ${selectedScenario}.`);
          setCompletedScenarios([...completedScenarios, selectedScenario]); // Mark as completed
          setSelectedScenario(null); // Reset scenario
          setCurrentStep(1); // Reset step
          fetchScenarios(); // Ask the player to choose another scenario
        } else {
          // Continue to the next step
          setCurrentStep(nextStep);
          updateStep(nextStep); // Update step in the backend
          fetchChoicesForStep(selectedScenario, nextStep);
        }
      } else if (outcome === 'failure') {
        appendToConsole(`Failed! Current health: ${currentHealth}. Try again.`);
      } else if (outcome === 'game-over') {
        appendToConsole('Game Over. Your unicorn has perished.');
        setUnicorn(null); // Reset game
      }
    } catch (error) {
      appendToConsole('Error submitting choice.');
    }
  };

  // Select a scenario and start from step 1
  const fetchChoices = async (scenarioId) => {
    setSelectedScenario(scenarioId);
    setCurrentStep(1); // Start at step 1
    fetchChoicesForStep(scenarioId, 1); // Fetch choices for step 1
    updateScenario(scenarioId); // Update the unicorn's current scenario
  };

  // Select and play with a specific unicorn
  const selectUnicorn = async (unicornId) => {
    const selectedUnicorn = unicorns.find((u) => u.id === unicornId);
    if (selectedUnicorn) {
      setUnicorn(selectedUnicorn);

      // If the unicorn is in the middle of a scenario, continue where they left off
      if (selectedUnicorn.currentScenario && selectedUnicorn.currentScenario > 0) {
        setSelectedScenario(selectedUnicorn.currentScenario);
        setCurrentStep(selectedUnicorn.currentStep || 1);
        appendToConsole(`Resuming Scenario ${selectedUnicorn.currentScenario} at Step ${selectedUnicorn.currentStep || 1}.`);
        fetchChoicesForStep(selectedUnicorn.currentScenario, selectedUnicorn.currentStep || 1);
      } else {
        appendToConsole(`Unicorn "${selectedUnicorn.name}" selected!`);
        appendToConsole('Choose a scenario using: select <scenarioId>');
        fetchScenarios();
      }
    } else {
      appendToConsole('Invalid unicorn selection.');
    }
  };

  // Update unicorn's current scenario in the backend
  const updateScenario = async (scenarioId) => {
    if (!unicorn) {
      appendToConsole('No unicorn selected.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/update-scenario', {
        unicornId: unicorn.id,
        scenarioId,
      });
      const updatedUnicorn = response.data.unicorn;
      setUnicorn(updatedUnicorn);
      appendToConsole(`Unicorn is now on Scenario ${scenarioId}.`);
    } catch (error) {
      appendToConsole('Error updating scenario.');
    }
  };

  // Update unicorn's current step in the backend
  const updateStep = async (step) => {
    if (!unicorn) {
      appendToConsole('No unicorn selected.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/update-step', {
        unicornId: unicorn.id,
        step,
      });
      const updatedUnicorn = response.data.unicorn;
      setUnicorn(updatedUnicorn);
      appendToConsole(`Unicorn is now on Step ${step} of the current scenario.`);
    } catch (error) {
      appendToConsole('Error updating step.');
    }
  };

  // Assign points to a specific attribute
  const assignPoints = async (attribute) => {
    if (!unicorn) {
      appendToConsole('No unicorn selected.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/assign-points', {
        unicornId: unicorn.id,
        attribute,
      });
      const updatedUnicorn = response.data.unicorn;
      setUnicorn(updatedUnicorn);
      appendToConsole(`Point assigned to ${attribute}. Updated stats: Force: ${updatedUnicorn.force}, Intelligence: ${updatedUnicorn.intelligence}, Esquive: ${updatedUnicorn.esquive}`);
    } catch (error) {
      appendToConsole('Error assigning points.');
    }
  };

  // Append to console
  const appendToConsole = (text) => {
    setConsoleOutput((prevOutput) => [...prevOutput, text]);
  };

  // Clear the console
  const clearConsole = () => {
    setConsoleOutput([]);
  };

  const navigateToAdmin = () =>{
    navigate('/admin')
  }

  // Handle command input (like a console)
  const handleCommandInput = (e) => {
    e.preventDefault();

    const parts = command.trim().split(' ');
    const action = parts[0].toLowerCase();

    clearConsole(); // Clear console after each command input

    // Create unicorn: create <name> <force> <intelligence> <esquive>
    if (action === 'create' && parts.length === 5) {
      const name = parts[1];
      const force = parseInt(parts[2]);
      const intelligence = parseInt(parts[3]);
      const esquive = parseInt(parts[4]);
      if (force + intelligence + esquive > 5) {
        appendToConsole('Total points must not exceed 5.');
      } else {
        createCharacter(name, force, intelligence, esquive);
      }
    }
    // Play with a unicorn: play <unicornId>
    else if (action === 'play' && parts.length === 2) {
      const unicornId = parseInt(parts[1]);
      selectUnicorn(unicornId);
    }
    // Select a scenario: select <scenarioId>
    else if (action === 'select' && parts.length === 2) {
      const scenarioId = parseInt(parts[1]);
      fetchChoices(scenarioId);
    }
    // Choose a choice: choose <choiceId>
    else if (action === 'choose' && parts.length === 2) {
      const choiceId = parseInt(parts[1]);
      submitChoice(choiceId);
    }
    // Assign points: assign <attribute>
    else if (action === 'assign' && parts.length === 2) {
      const attribute = parts[1];
      assignPoints(attribute);
    }
    //Access the admin panel 
    else if (action === 'admin') {
      navigateToAdmin()
    }
    // Clear console
    else if (action === 'clear') {
      clearConsole();
    } else {
      appendToConsole('Invalid command. Try: create <name> <force> <intelligence> <esquive>, play <unicornId>, select <scenarioId>, or choose <choiceId>.');
    }

    setCommand(''); // Clear the command input
  };

  // Main JSX rendering
  return (
    <div className='gamePlay--console'>
      <div className="console-output">
        {consoleOutput.map((output, index) => (
          <div key={index}>{output}</div>
        ))}
      </div>
      <form onSubmit={handleCommandInput}>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command..."
        />
      </form>
    </div>
  );
}
