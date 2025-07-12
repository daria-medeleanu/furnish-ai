import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../../../utils/apiUtils';

const CategorySelector = ({ value, onChange, error, onErrorClear }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    onChange(e.target.value);
    if (onErrorClear) onErrorClear();
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="category">
      <label>Category*:</label>
      <select value={value} onChange={handleChange}>
        <option value="">Select a category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.title}
          </option>
        ))}
      </select>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default CategorySelector;