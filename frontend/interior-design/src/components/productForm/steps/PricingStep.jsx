import React from 'react';
import PriceInput from '../formComponents/PriceInput';

const PricingStep = ({
  title,
  categoryID,
  condition,
  price, setPrice,
  currency, setCurrency,
  categories,
  error,
  onNext,
  onPrevious,
  onErrorClear
}) => {
  return (
    <>
      <div className="title">Set Price</div>
      <div className="add-product-form">
        <div className="product-summary">
          <h4>Product Summary:</h4>
          <p><strong>Title:</strong> {title}</p>
          {categoryID && (
            <p><strong>Category:</strong> {categories.find(cat => (cat.id || cat.categoryID || cat.CategoryID) === categoryID)?.title}</p>
          )}
          {condition && (
            <p><strong>Condition:</strong> {condition}</p>
          )}
        </div>

        <PriceInput
          price={price}
          currency={currency}
          onPriceChange={setPrice}
          onCurrencyChange={setCurrency}
          onErrorClear={onErrorClear}
        />

        {error && <div className="error-message-add-product-step2">{error}</div>}

        <div style={{color:'#485c11'}}>
          On our platform, prices are negotiable! Buyers can make offers, and you choose which one to accept. 
          Once you accept, the first buyer to place the order at the agreed price gets the item!
        </div>

        <div className="step-buttons">
          <button
            type="button"
            className="back-button"
            onClick={onPrevious}
          >
            ← Back
          </button>
          <button
            type="button"
            className="next-button"
            onClick={onNext}
          >
            Next: Add Images →
          </button>
        </div>
      </div>
    </>
  );
};

export default PricingStep;