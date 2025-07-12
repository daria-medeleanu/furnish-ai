import React, { useState, useEffect } from 'react';
import ProductDetailsStep from '../../components/productForm/steps/ProductDetailsStep';
import PricingStep from '../../components/productForm/steps/PricingStep';
import ImageUploadStep from '../../components/productForm/steps/ImageUploadStep';
import CustomizationStep from '../../components/productForm/steps/CustomizationStep';
import { fetchCategories, createProduct } from '../../utils/apiUtils';

const AddProductWizard = ({ productForm, imageManagement, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleNext = () => {
    if (productForm.validateStep(productForm.currentStep)) {
      productForm.setCurrentStep(productForm.currentStep + 1);
    }
  };

  const handlePrevious = () => {
    productForm.setCurrentStep(productForm.currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    productForm.clearMessages();

    try {
      const imageUrls = await imageManagement.uploadAllImages();
      
      const productData = {
        ...productForm.getFormData(),
        imageUrls: imageUrls
      };

      await createProduct(productData);
      
      productForm.setSuccess('Product added successfully!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);

    } catch (error) {
      productForm.setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (productForm.currentStep) {
      case 1:
        return (
          <ProductDetailsStep
            title={productForm.title}
            setTitle={productForm.setTitle}
            description={productForm.description}
            setDescription={productForm.setDescription}
            categoryID={productForm.categoryID}
            setCategoryID={productForm.setCategoryID}
            condition={productForm.condition}
            setCondition={productForm.setCondition}
            error={productForm.error}
            onNext={handleNext}
            onErrorClear={productForm.clearMessages}
          />
        );

      case 2:
        return (
          <PricingStep
            title={productForm.title}
            categoryID={productForm.categoryID}
            condition={productForm.condition}
            price={productForm.price}
            setPrice={productForm.setPrice}
            currency={productForm.currency}
            setCurrency={productForm.setCurrency}
            categories={categories}
            error={productForm.error}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onErrorClear={productForm.clearMessages}
          />
        );

      case 3:
        return (
          <ImageUploadStep
            images={imageManagement.images}
            generatedImages={imageManagement.generatedImages}
            onImageChange={imageManagement.handleImageChange}
            onRemoveImage={imageManagement.removeImage}
            onRemoveGeneratedImage={imageManagement.removeGeneratedImage}
            error={productForm.error}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onErrorClear={productForm.clearMessages}
          />
        );

      case 4:
        return (
          <CustomizationStep
            images={imageManagement.images}
            generatedImages={imageManagement.generatedImages}
            onAddGeneratedImage={imageManagement.addGeneratedImage}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
            isSubmitting={isSubmitting}
            error={productForm.error}
            success={productForm.success}
            showImageLimitModal={imageManagement.showImageLimitModal}
            setShowImageLimitModal={imageManagement.setShowImageLimitModal}
            imageLimitSelection={imageManagement.imageLimitSelection}
            setImageLimitSelection={imageManagement.setImageLimitSelection}
            pendingImagesToAdd={imageManagement.pendingImagesToAdd}
            setPendingImagesToAdd={imageManagement.setPendingImagesToAdd}
            setGeneratedImages={imageManagement.setGeneratedImages}
          />
        );

      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="add-product-wizard">
      {renderCurrentStep()}
    </div>
  );
};

export default AddProductWizard;