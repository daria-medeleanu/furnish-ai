import React from 'react';

const ConditionSelector = ({ value, onChange, onErrorClear }) => {
  const conditionOptions = [
    {
      value: 'Excellent',
      label: 'Excellent',
      description: 'Like new, barely used, no visible damage.'
    },
    {
      value: 'Good',
      label: 'Good',
      description: 'Minor signs of wear, fully functional, no major damage.'
    },
    {
      value: 'Fair',
      label: 'Fair',
      description: 'Noticeable wear and tear, still usable but with some flaws.'
    },
    {
      value: 'Poor',
      label: 'Poor',
      description: 'Heavy wear, damage, or partial functionality; may need repair.'
    }
  ];

  const handleChange = (e) => {
    onChange(e.target.value);
    if (onErrorClear) onErrorClear();
  };

  return (
    <div className="condition-selector">
      {conditionOptions.map((conditionOption) => (
        <div key={conditionOption.value} className="condition-option">
          <label className="condition-label">
            <input
              type="radio"
              name="condition"
              value={conditionOption.value}
              checked={value === conditionOption.value}
              onChange={handleChange}
              className="condition-radio"
            />
            <div className="condition-content">
              <span className="condition-name">{conditionOption.label}</span>
              <span className="condition-description">{conditionOption.description}</span>
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default ConditionSelector;