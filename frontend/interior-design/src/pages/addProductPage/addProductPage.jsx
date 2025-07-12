import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Alert from '../../components/alert/Alert';
import AddProductWizard from './AddProductWizard';
import StepIndicator from '../../components/productForm/formComponents/StepIndicator';
import { useProductForm } from '../../hooks/useProductForm';
import { useImageManagement } from '../../hooks/useImageManagement';
import './addProductPage.css';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  
  const productForm = useProductForm();
  const imageManagement = useImageManagement();

  const handleBackToHome = () => {
    const hasData = productForm.title || productForm.description || 
                   productForm.price || productForm.condition || 
                   productForm.categoryID || imageManagement.images.length > 0;
    
    if (hasData) {
      setAlertOpen(true);
    } else {
      navigate('/home');
    }
  };
  
  const handleConfirmLeave = () => {
    productForm.resetForm();
    navigate('/home');
  };

  return (
    <>
      <Navbar page="home" />
      <div className="add-product-wrapper">
        <div className="add-product">
          <div className='left-side-add-page'>
            <button
              className="back-to-prev-btn"
              onClick={handleBackToHome}
            >
              ← Back to home
            </button>
            <StepIndicator
              currentStep={productForm.currentStep}
              setCurrentStep={productForm.setCurrentStep}
            />
          </div>
          
          <div className="add-product-container">
            <AddProductWizard
              productForm={productForm}
              imageManagement={imageManagement}
              onSuccess={() => navigate('/seller-controller')}
            />
          </div>
        </div>
      </div>
      
      <Alert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={handleConfirmLeave}
        title="Confirm Navigation"
        message="Are you sure you want to go back? All completed information will be lost."
        cancelText="Stay"
        confirmText="Leave"
      />
    </>
  );
};

export default AddProductPage;