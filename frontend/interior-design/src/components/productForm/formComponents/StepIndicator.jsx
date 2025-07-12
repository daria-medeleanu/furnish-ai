import React from 'react';

const StepIndicator = ({ currentStep, setCurrentStep }) => {
  const steps = [
    { number: 1, title: 'Details' },
    { number: 2, title: 'Price' },
    { number: 3, title: 'Images' },
    { number: 4, title: 'Custom' }
  ];

  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div 
            onClick={() => setCurrentStep(step.number)} 
            className={`step ${currentStep >= step.number ? 'active' : ''}`}
          >
            <span className="step-number">{step.number}</span>
            <span className="step-title">{step.title}</span>
          </div>
          {index < steps.length - 1 && <div className="step-connector"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;