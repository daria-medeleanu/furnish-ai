import React from 'react';

const ImageUploadStep = ({
  images,
  generatedImages,
  onImageChange,
  onRemoveImage,
  onRemoveGeneratedImage,
  error,
  onNext,
  onPrevious,
  onErrorClear
}) => {
  const handleFileChange = async (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      if(newFiles.length > 5) {
        onErrorClear();
        return;
      }
      
      try {
        await onImageChange(newFiles);
        onErrorClear();
      } catch (error) {
      }
    }
  };

  return (
    <>
      <div className="title">Add Product Images</div>
      <div className="add-product-form">
        
        <label>Product Images:</label>
        <div className="image-upload-area">
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange}
            id="image-upload"
          />
          <label htmlFor="image-upload" className="upload-label">
            <span className="upload-icon">📷</span>
            <span>Choose Images</span>
            <span className="upload-hint">JPG, PNG, WEBP (Maximum 5 files allowed!)</span>
          </label>
        </div>
        
        {images.length > 0 && (
          <div className="image-preview-grid">
            {images.map((imgObj, idx) => (
              <div key={imgObj.id} className="image-preview-item">
                <img 
                  src={imgObj.base64Data} 
                  alt="preview" 
                  className="image-preview"
                  onLoad={() => console.log(`Image ${idx} loaded successfully`)}
                  onError={(e) => {
                    console.error(`Image ${idx} failed to load:`, e);
                    console.log('Image object:', imgObj);
                    console.log('Base64 data preview:', imgObj.base64Data?.substring(0, 50) + '...');
                  }}
                />                            
                <button 
                  type="button"
                  className="remove-image-btn"
                  onClick={() => onRemoveImage(idx)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {generatedImages && generatedImages.length > 0 && (
          <>
            <label>Generated Images:</label>
            <div className="image-preview-grid">
              {generatedImages.map((imgObj, idx) => (
                <div key={imgObj.id} className="image-preview-item">
                  <img 
                    src={imgObj.base64Data} 
                    alt="generated preview" 
                    className="image-preview"
                  />                            
                  <button 
                    type="button"
                    className="remove-image-btn"
                    onClick={() => onRemoveGeneratedImage(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        
        <div className="step-buttons">
          {error && <div className="error-message-add-product-step3">{error}</div>}
          <button 
            type="button" 
            className="back-button"
            onClick={onPrevious}
          >
            ← Back
          </button>
          
          <button 
            type="button" 
            className="submit-button"
            onClick={onNext}
          >
            ✨ Customize Background
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageUploadStep;