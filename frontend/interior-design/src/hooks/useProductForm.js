import { useState } from 'react';
import Cookies from 'js-cookie';

export const useProductForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('RON');
  const [categoryID, setCategoryID] = useState('');
  const [condition, setCondition] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setCurrency('RON');
    setCategoryID('');
    setCondition('');
    setCurrentStep(1);
    clearMessages();
  };

  const validateStep = (step) => {
    clearMessages();
    
    switch (step) {
      case 1:
        if (!categoryID) {
          setError('Category is required.');
          return false;
        }
        if (!title.trim()) {
          setError('Title is required.');
          return false;
        }
        if (!condition.trim()) {
          setError('Condition of the piece is required.');
          return false;
        }
        return true;
      
      case 2:
        if (!price || parseFloat(price) <= 0) {
          setError('Valid price is required.');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const getFormData = () => {
    const userId = Cookies.get("userID");
    return {
      title,
      description: description || null,
      price: parseFloat(price),
      categoryID: categoryID || null,
      condition,
      currency,
      userID: userId,
    };
  };

  return {
    title, setTitle,
    description, setDescription,
    price, setPrice,
    currency, setCurrency,
    categoryID, setCategoryID,
    condition, setCondition,
    currentStep, setCurrentStep,
    error, setError,
    success, setSuccess,
    
    clearMessages,
    resetForm,
    validateStep,
    getFormData,
  };
};