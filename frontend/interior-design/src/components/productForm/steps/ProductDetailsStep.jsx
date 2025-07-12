import React from 'react';
import DescriptionEditor from '../../editor/Editor';
import CategorySelector from '../formComponents/CategorySelector';
import ConditionSelector from '../formComponents/ConditionSelector';

const ProductDetailsStep = ({
  title, setTitle,
  description, setDescription,
  categoryID, setCategoryID,
  condition, setCondition,
  error,
  onNext,
  onErrorClear
}) => {
  return (
    <>
      <div className="title">Product Details</div>
      <div className="add-product-form">
        <div className="flex-row">
          <CategorySelector
            value={categoryID}
            onChange={setCategoryID}
            onErrorClear={onErrorClear}
          />
          <div className="title-add">
            <label>Title*:</label>
            <input
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                onErrorClear();
              }}
              placeholder="Enter product title"
              maxLength={50}
            />
          </div>
        </div>

        <label>Description:</label>
        <DescriptionEditor
          value={description}
          onChange={setDescription}
        />

        <label>Condition*:</label>
        <div className="condition-wrapper">
          <ConditionSelector
            value={condition}
            onChange={setCondition}
            onErrorClear={onErrorClear}
          />
          <div className="error-spacer">
            {error && <div className="error-message-add-product-step1">{error}</div>}
          </div>
        </div>

        <button
          type="button"
          className="next-button"
          onClick={onNext}
        >
          Next: Set Price →
        </button>
      </div>
    </>
  );
};

export default ProductDetailsStep;