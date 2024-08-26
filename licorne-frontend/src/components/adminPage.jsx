import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [scenarioLevel, setScenarioLevel] = useState('');
  const [steps, setSteps] = useState([
    { id: 1, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
    { id: 2, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
    { id: 3, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
  ]);
  const [scenarios, setScenarios] = useState([]);  // Holds all scenarios
  const [selectedScenarioId, setSelectedScenarioId] = useState(null); // For editing
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScenarios(); // Fetch scenarios on component mount
  }, []);

  // Fetch all scenarios from backend
  const fetchScenarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/get-scenario');
      setScenarios(response.data.scenario);
    } catch (error) {
      setError('Error fetching scenarios');
    }
  };

  // Handle scenario description input change
  const handleScenarioChange = (e) => {
    setScenarioDescription(e.target.value);
  };

  // Handle scenario level input change
  const handleScenarioLevelChange = (e) => {
    setScenarioLevel(e.target.value);
  };

  // Handle changes to choices inputs
  const handleChoiceChange = (stepId, choiceId, field, value) => {
    setSteps((prevSteps) => {
      return prevSteps.map((step) => {
        if (step.id === stepId) {
          const updatedChoices = step.choices.map((choice, index) => {
            if (index === choiceId) {
              return { ...choice, [field]: value };
            }
            return choice;
          });
          return { ...step, choices: updatedChoices };
        }
        return step;
      });
    });
  };

  // Form validation function
  const validateForm = () => {
    if (!scenarioDescription || !scenarioLevel) {
      return 'Scenario description and level are required';
    }

    for (const step of steps) {
      if (step.choices.length !== 3) {
        return `Each step must have exactly 3 choices. Step ${step.id} is invalid.`;
      }
      for (const choice of step.choices) {
        if (!choice.text || !choice.requiredAttribute || choice.requiredPoints <= 0 || !choice.outcomeSuccess || !choice.outcomeFailure) {
          return `All choices in step ${step.id} must have valid text, required attribute, required points, success outcome, and failure outcome.`;
        }
      }
    }
    return ''; // If no validation errors
  };

  // Handle form submission for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const scenarioData = {
      description: scenarioDescription,
      level: parseInt(scenarioLevel),
      steps: steps.map((step) => ({
        choices: step.choices,
      })),
    };

    try {
      if (selectedScenarioId) {
        // Update scenario
        await axios.put(`http://localhost:3000/api/update-scenario/${selectedScenarioId}`, scenarioData);
        setError('');
        alert('Scenario updated successfully!');
      } else {
        // Create new scenario
        await axios.post('http://localhost:3000/api/create-scenario', scenarioData);
        setError('');
        alert('Scenario created successfully!');
      }

      fetchScenarios(); // Refresh scenarios after insert/update
      resetForm();
    } catch (error) {
      setError('Failed to save scenario');
    }
  };

  // Reset form state after submission
  const resetForm = () => {
    setScenarioDescription('');
    setScenarioLevel('');
    setSteps([
      { id: 1, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
      { id: 2, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
      { id: 3, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
    ]);
    setSelectedScenarioId(null); // Reset selected scenario
  };

  const handleEdit = async (scenario) => {
    try {
      // Fetch scenario along with its choices
      const response = await axios.get(`http://localhost:3000/api/getScenario-choices/${scenario.id}`);
      const fetchedScenario = response.data;
  
      // Set scenario description and level
      setScenarioDescription(fetchedScenario.description);
      setScenarioLevel(fetchedScenario.level);
  
      // Group the choices into steps
      const step1Choices = fetchedScenario.choices.slice(0, 3); // First 3 choices for step 1
      const step2Choices = fetchedScenario.choices.slice(3, 6); // Next 3 choices for step 2
      const step3Choices = fetchedScenario.choices.slice(6, 9); // Last 3 choices for step 3
  
      // Set the steps with the choices
      const updatedSteps = [
        {
          id: 1,
          choices: step1Choices.map(choice => ({
            text: choice.text || '',
            requiredAttribute: choice.required_attribute || '',
            requiredPoints: choice.required_points || 0,
            outcomeSuccess: choice.outcome_success || '',
            outcomeFailure: choice.outcome_failure || ''
          })),
        },
        {
          id: 2,
          choices: step2Choices.map(choice => ({
            text: choice.text || '',
            requiredAttribute: choice.required_attribute || '',
            requiredPoints: choice.required_points || 0,
            outcomeSuccess: choice.outcome_success || '',
            outcomeFailure: choice.outcome_failure || ''
          })),
        },
        {
          id: 3,
          choices: step3Choices.map(choice => ({
            text: choice.text || '',
            requiredAttribute: choice.required_attribute || '',
            requiredPoints: choice.required_points || 0,
            outcomeSuccess: choice.outcome_success || '',
            outcomeFailure: choice.outcome_failure || ''
          })),
        },
      ];
  
      setSteps(updatedSteps); // Set steps with the updated choices
      setSelectedScenarioId(fetchedScenario.scenarioId); // Set scenario id for update
    } catch (error) {
      setError('Error loading scenario for editing');
    }
  };


  // Delete scenario
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      try {
        await axios.delete(`http://localhost:3000/api/delete-scenario/${id}`);
        alert('Scenario deleted successfully!');
        fetchScenarios(); // Refresh after delete
      } catch (error) {
        setError('Failed to delete scenario');
      }
    }
  };

  return (
    <div className="adminPage--main">
      <h1>Create or Edit a Scenario</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} className='choice--form'>
        <div>
          <input type="text" placeholder="Scenario Description" value={scenarioDescription} onChange={handleScenarioChange} required />
          <input type="number" placeholder="Scenario Level" value={scenarioLevel} onChange={handleScenarioLevelChange} required />
        </div>
        <div className=''>
          {steps.map((step, stepIndex) => (
            <div key={step.id} className='scenario--form'>
              <h3>Step {step.id}</h3>
              {step.choices.map((choice, choiceIndex) => (
                <div key={choiceIndex}>
                  <input type="text" placeholder="Choice Text" value={choice.text} onChange={(e) => handleChoiceChange(step.id, choiceIndex, 'text', e.target.value)} required />
                  <select value={choice.requiredAttribute} onChange={(e) => handleChoiceChange(step.id, choiceIndex, 'requiredAttribute', e.target.value)} required>
                    <option value="">Select Attribute</option>
                    <option value="force">Force</option>
                    <option value="intelligence">Intelligence</option>
                    <option value="esquive">Esquive</option>
                  </select>
                  <input type="number" placeholder="Required Points" value={choice.requiredPoints} onChange={(e) => handleChoiceChange(step.id, choiceIndex, 'requiredPoints', e.target.value)} required />
                  <input type="text" placeholder="Success Outcome" value={choice.outcomeSuccess} onChange={(e) => handleChoiceChange(step.id, choiceIndex, 'outcomeSuccess', e.target.value)} required />
                  <input type="text" placeholder="Failure Outcome" value={choice.outcomeFailure} onChange={(e) => handleChoiceChange(step.id, choiceIndex, 'outcomeFailure', e.target.value)} required />
                </div>
              ))}
            </div>
          ))}
        </div>

        <button type="submit">{selectedScenarioId ? 'Update Scenario' : 'Create Scenario'}</button>
      </form>

      <h2>Existing Scenarios</h2>
      <ul>
        {scenarios.map((scenario) => (
          <li key={scenario.id}>
            <p><strong>{scenario.description}</strong> (Level: {scenario.level})</p>
            <button onClick={() => handleEdit(scenario)}>Edit</button>
            <button onClick={() => handleDelete(scenario.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
