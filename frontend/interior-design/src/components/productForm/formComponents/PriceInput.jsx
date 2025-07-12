import React from 'react';

const PriceInput = ({ price, currency, onPriceChange, onCurrencyChange, onErrorClear }) => {
  const handlePriceChange = (e) => {
    onPriceChange(e.target.value);
    if (onErrorClear) onErrorClear();
  };

  return (
    <div className="price-input-container">
      <div className="price-field">
        <label>Price*:</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={handlePriceChange}
          placeholder="0.00"
          min="0"
        />
      </div>
      <div className="currency-field">
        <label>Currency:</label>
        <select
          value={currency}
          onChange={e => onCurrencyChange(e.target.value)}
          className="currency-select"
        >
          <option value="RON">Lei (RON)</option>
          <option value="EUR">Euro (EUR)</option>
        </select>
      </div>
    </div>
  );
};

export default PriceInput;