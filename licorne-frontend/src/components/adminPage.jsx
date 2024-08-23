import React, { useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [scenarioLevel, setScenarioLevel] = useState(''); // Field for scenario level
  const [steps, setSteps] = useState([
    { id: 1, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
    { id: 2, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
    { id: 3, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
  ]);
  const [error, setError] = useState('');

  // Handle scenario description input
  const handleScenarioChange = (e) => {
    setScenarioDescription(e.target.value);
  };

  // Handle scenario level input
  const handleScenarioLevelChange = (e) => {
    setScenarioLevel(e.target.value);
  };

  // Handle choice input changes
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

  // Validate the form to ensure each step has 3 choices and required fields are filled
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

    return '';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Data to be sent to the backend
    const scenarioData = {
      description: scenarioDescription,
      level: parseInt(scenarioLevel),
      steps: steps.map((step) => ({
        choices: step.choices,
      })),
    };

    try {
      await axios.post('http://localhost:3000/api/create-scenario', scenarioData);
      setError(''); // Clear error
      alert('Scenario created successfully!');
      // Reset form
      setScenarioDescription('');
      setScenarioLevel('');
      setSteps([
        { id: 1, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
        { id: 2, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
        { id: 3, choices: [{ text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }, { text: '', requiredAttribute: '', requiredPoints: 0, outcomeSuccess: '', outcomeFailure: '' }] },
      ]);
    } catch (error) {
      setError('Failed to create scenario.');
    }
  };

  return (
    <div className='adminPage--main'>
      <h1>Create a New Scenario</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} >
        <div className='scenario--form'>
          <div>
            <input type="text" placeholder='Scenario Description' value={scenarioDescription} onChange={handleScenarioChange} required />
          </div>

          <div>
            <input type="number" placeholder='Scenario Level' value={scenarioLevel} onChange={handleScenarioLevelChange} required />
          </div>
        </div>
        <div >
        {steps.map((step, stepIndex) => (
          <div key={step.id}>
            <h3>Step {step.id}</h3>
            <div className='choice--form'>
            {step.choices.map((choice, choiceIndex) => (
              <div key={choiceIndex}>
                <h4>Choice {choiceIndex + 1}</h4>
                <input
                  type="text"
                  placeholder='Choice Text'
                  value={choice.text}
                  onChange={(e) => handleChoiceChange(step.id, choiceIndex, 'text', e.target.value)}
                  required
                />
                <select
                  value={choice.requiredAttribute}
                  onChange={(e) => handleChoiceChange(step.id, choiceIndex, 'requiredAttribute', e.target.value)}
                  required
                >
                  <option value="">Select Attribute</option>
                  <option value="force">Force</option>
                  <option value="intelligence">Intelligence</option>
                  <option value="esquive">Esquive</option>
                </select>
                <input
                  type="number"
                  placeholder='Required Points'
                  value={choice.requiredPoints}
                  onChange={(e) => handleChoiceChange(step.id, choiceIndex, 'requiredPoints', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder='Success Outcome'
                  value={choice.outcomeSuccess}
                  onChange={(e) => handleChoiceChange(step.id, choiceIndex, 'outcomeSuccess', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder='Failure Outcome'
                  value={choice.outcomeFailure}
                  onChange={(e) => handleChoiceChange(step.id, choiceIndex, 'outcomeFailure', e.target.value)}
                  required
                />
                
              </div>
            ))}
            </div>
          </div>
        ))}
        </div>
        <button type="submit">Create Scenario</button>
      </form>
    </div>
  );
}
