import React, { useState } from 'react';
import PromptMenu from '../../promptMenu/promptMenu';
import MaskDrawingApp from '../../../pages/manualMaskPage/manualMask';
import AdvancedPromptSettings from '../../advancedPromptSettings/AdvancedPromptSettings';
import { generateInpaintImage } from '../../../utils/apiUtils';
import { uploadToCloudinary, convertFileToBase64, base64ToFile } from '../../../utils/imageUtils';

const CustomizationStep = ({
  images,
  generatedImages,
  onAddGeneratedImage,
  onSubmit,
  onPrevious,
  isSubmitting,
  error,
  success,
  showImageLimitModal,
  setShowImageLimitModal,
  imageLimitSelection,
  setImageLimitSelection,
  pendingImagesToAdd,
  setPendingImagesToAdd,
  setGeneratedImages
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedMaskType, setSelectedMaskType] = useState(null);
  const [autoMask, setAutoMask] = useState(null);
  const [manualMask, setManualMask] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [customizationResult, setCustomizationResult] = useState(null);
  const [customizationError, setCustomizationError] = useState('');
  const [isGeneratingResult, setIsGeneratingResult] = useState(false);
  const [showManualMaskModal, setShowManualMaskModal] = useState(false);
  const [showMaskPreviewModal, setShowMaskPreviewModal] = useState(false);
  const [previewMaskSrc, setPreviewMaskSrc] = useState('');
  const [masksByImage, setMasksByImage] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState("blurry, bad quality, distorted, ugly, cluttered, messy, poor lighting, low resolution, busy background");
  const [numInferenceSteps, setNumInferenceSteps] = useState(25);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState(-1);

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
    setCustomizationError('');
    const imageId = images[index].id;
    const masks = masksByImage[imageId] || {};
    setAutoMask(masks.auto || null);
    setManualMask(masks.manual || null);
    setSelectedMaskType(masks.manual ? 'manual' : (masks.auto ? 'auto' : null));
  };

  const handleManualMaskNavigation = () => {
    if (selectedImageIndex === null) return;
    setShowManualMaskModal(true);
  };

  const handleManualMaskComplete = (maskDataUrl) => {
    setManualMask(maskDataUrl);
    setSelectedMaskType('manual');
    setShowManualMaskModal(false);

    if (selectedImageIndex !== null) {
      const imageId = images[selectedImageIndex].id;
      setMasksByImage(prev => ({
        ...prev,
        [imageId]: {
          ...(prev[imageId] || {}),
          manual: maskDataUrl
        }
      }));
    }
  };

  const handleManualMaskCancel = () => {
    setShowManualMaskModal(false);
  };

  const handleManualMaskUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/jpg';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        setManualMask(event.target.result);
        setSelectedMaskType('manual');
        if (selectedImageIndex !== null) {
          const imageId = images[selectedImageIndex].id;
          setMasksByImage(prev => ({
            ...prev,
            [imageId]: {
              ...(prev[imageId] || {}),
              manual: event.target.result
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handlePromptGenerated = (prompt) => {
    setCustomPrompt(prompt);
  };

  const getSelectedMask = () => {
    return selectedMaskType === 'auto' ? autoMask : manualMask;
  };

  const handleInpaintImage = async () => {
  if (selectedImageIndex === null || !getSelectedMask() || !customPrompt) {
    setCustomizationError('Please select an image, generate a mask, and provide a prompt.');
    return;
  }

  try {
    setIsGeneratingResult(true);
    setCustomizationError('');
    setCustomizationResult(null);

    const selectedImage = images[selectedImageIndex];
    const selectedMask = getSelectedMask();

    const imageFile = base64ToFile(selectedImage.base64Data, selectedImage.name, selectedImage.type);
    const maskFile = base64ToFile(selectedMask, 'mask.png', 'image/png');

    const formData = new FormData();
    formData.append('OriginalImage', imageFile);  
    formData.append('MaskImage', maskFile);       
    formData.append('prompt', customPrompt);
    formData.append('negativePrompt', negativePrompt);
    formData.append('numInferenceSteps', numInferenceSteps.toString());
    formData.append('guidanceScale', guidanceScale.toString());
    if (seed !== -1) {
      formData.append('seed', seed.toString());
    }

    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const resultBlob = await generateInpaintImage(formData);
    
    const resultDataUrl = URL.createObjectURL(resultBlob);
    setCustomizationResult(resultDataUrl);

  } catch (error) {
    setCustomizationError(error.message || 'Failed to generate customized image');
  } finally {
    setIsGeneratingResult(false);
  }
};

const handleUseCustomizedImage = async () => {
  if (!customizationResult) return;
  
  try {
    const response = await fetch(customizationResult);
    const blob = await response.blob();
    const file = new File([blob], `customized-${Date.now()}.png`, { type: 'image/png' });
    
    const cloudinaryUrl = await uploadToCloudinary(file);
    
    const base64Data = await convertFileToBase64(file);
    
    const serializableImage = {
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      base64Data: base64Data,
      cloudinaryUrl: cloudinaryUrl,
      originalFile: null
    };

    await onAddGeneratedImage(serializableImage);
    
    setSelectedImageIndex(null);
    setManualMask(null);
    setCustomPrompt('');
    setCustomizationResult(null);
    setCustomizationError('');
    setSelectedMaskType(null);
    
  } catch (error) {
    setCustomizationError('Failed to add customized image: ' + error.message);
  }
};

  const handleMaskPreview = (maskSrc) => {
    setPreviewMaskSrc(maskSrc);
    setShowMaskPreviewModal(true);
  };

  const closeMaskPreview = () => {
    setShowMaskPreviewModal(false);
    setPreviewMaskSrc('');
  };

  return (
    <>
      <div className="title">Customize Background with AI</div>
      <div className="add-product-form">
        
        <div className="customization-section">
          <h3>1. Select only one image to customize</h3>
          {images.length === 0 ? (
            <p>No images available. Please go back and add images first.</p>
          ) : (
            <div className="image-selection-grid">
              {images.map((imgObj, idx) => (
                <div 
                  key={imgObj.id} 
                  className={`image-selection-item ${selectedImageIndex === idx ? 'selected' : ''}`}
                  onClick={() => handleImageSelect(idx)}
                >
                  <img 
                    src={imgObj.base64Data} 
                    alt={`Image ${idx + 1}`}
                    className="image-selection-preview"
                    onContextMenu={e => e.preventDefault()} 
                    draggable={false}
                  />
                  <div className="image-selection-label">
                    {imgObj.name || `Image ${idx + 1}`}
                  </div>
                  {selectedImageIndex === idx && (
                    <div className="selection-indicator">✓</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="customization-section">
          <h3>Here are the generated images</h3>
          {(generatedImages.length === 0 || images.length === 0) ? (
            <p>No generated images yet.</p>
          ) : (
            <div className="image-selection-grid">
              {generatedImages.map((imgObj, idx) => (
                <div
                  key={imgObj.id}
                  className="image-selection-item"
                  style={{ position: 'relative', cursor: 'pointer' }}
                >
                  <img
                    src={imgObj.base64Data}
                    alt={`Image ${idx + 1}`}
                    className="image-selection-preview"
                    onClick={() => {
                      setPreviewMaskSrc(imgObj.base64Data);
                      setShowMaskPreviewModal(true);
                    }}
                    onContextMenu={e => e.preventDefault()} 
                    draggable={false}
                  />
                  <div className="image-selection-label">
                    {imgObj.name || `Image ${idx + 1}`}
                  </div>
                  
                  <button
                    type="button"
                    title="Remove"
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      background: '#fff',
                      border: '1px solid #d33',
                      color: '#d33',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      fontWeight: 'bold',
                      fontSize: 16,
                      cursor: 'pointer',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      lineHeight: 1,
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      setGeneratedImages(prev => prev.filter((_, i) => i !== idx));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="customization-section">
          <h3>2. Generate Object Mask</h3>
          <p>Create a mask to isolate the furniture from the background. </p>
          <p>Object will be colored with black (mask), and the background will be white (space to generate).</p>  
          <p>The model will accept images of max 768x768. Any other form will resized with respect to the aspect ratio</p>
          
          <div className="mask-buttons">
            <button
              className="mask-button"
              onClick={handleManualMaskNavigation}
            >
              {manualMask ? 'Create new Manual Mask' : 'Create Manual Mask'}
            </button>
            <button
              className="mask-button"
              onClick={handleManualMaskUpload}
            >
              Upload manual mask
            </button>
          </div>

          {(autoMask || manualMask) && (
            <div className="mask-selection">
              <h4>Select Mask to Use:</h4>
              <div className="mask-options">
                {manualMask && (
                  <div 
                    className={`mask-option ${selectedMaskType === 'manual' ? 'selected' : ''}`}
                    onClick={() => setSelectedMaskType('manual')}
                  >
                    <div className="mask-option-label">Manual Created</div>
                    <img 
                      src={manualMask} 
                      alt="Manual Mask" 
                      className="mask-preview"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMaskPreview(manualMask);
                      }}
                    />
                    <div className="mask-preview-hint">Click image to view full size</div>
                    {selectedMaskType === 'manual' && <div className="mask-selected">✓ Selected</div>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {selectedMaskType && (
          <div className="customization-section">
            <h3>3. Describe Your Desired Background</h3>
            <p>Use the prompt generator to describe the perfect setting for your furniture.</p>
            
            <PromptMenu onPromptGenerated={handlePromptGenerated} />
            
            {customPrompt !== undefined && (
              <div className="prompt-display">
                <div className="prompt-label">Generated Prompt (editable):</div>
                <textarea
                  className="prompt-text"
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    minHeight: 60,
                    resize: 'vertical',
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    padding: 8,
                    fontSize: 15,
                    fontFamily: "'Fira Mono', 'DM Sans', 'Consolas', 'monospace', sans-serif", 
                  }}
                />
              </div>
            )}
          </div>
        )}

        {customPrompt && selectedMaskType && (
          <AdvancedPromptSettings
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            numInferenceSteps={numInferenceSteps}
            setNumInferenceSteps={setNumInferenceSteps}
            guidanceScale={guidanceScale}
            setGuidanceScale={setGuidanceScale}
            seed={seed}
            setSeed={setSeed}
          />
        )}

        {customPrompt && selectedMaskType && (
          <div className="customization-section">
            <h3>4. Generate AI Background</h3>
            <div className="generation-summary">
              <div className="summary-item">
                <strong>Selected Image:</strong> {images[selectedImageIndex]?.name || `Image ${selectedImageIndex + 1}`}
              </div>
              <div className="summary-item">
                <strong>Mask Type:</strong> {selectedMaskType === 'auto' ? 'Auto Generated' : 'Manual Created'}
              </div>
              <div className="summary-item">
                <strong>Prompt:</strong> {customPrompt}
              </div>
            </div>
            
            <button
              className={`generate-button ${isGeneratingResult ? 'loading' : ''}`}
              onClick={handleInpaintImage}
              disabled={isGeneratingResult}
            >
              {isGeneratingResult ? (
                <>
                  <div className="spinner"></div>
                  Generating AI Background...
                </>
              ) : (
                <>
                  🎨 Generate AI Background
                </>
              )}
            </button>
            
            {customizationError && (
              <div className="customization-error">{customizationError}</div>
            )}
            
            {customizationResult && (
              <div className="result-section">
                <h4>Generated Result</h4>
                <img
                  src={customizationResult}
                  alt="Customized Result"
                  className="result-image"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setPreviewMaskSrc(customizationResult);
                    setShowMaskPreviewModal(true);
                  }}
                />
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                  Click image to maximize
                </div>
                <div className="result-actions">
                  <button
                    className="use-result-button"
                    onClick={handleUseCustomizedImage}
                  >
                    Add to Product Images
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="step-buttons">
          {error && <div className="error-message-add-product-step4">{error}</div>}
          {success && <div className="success-message-add-product">{success}</div>}
          <button 
            type="button" 
            className="back-button"
            onClick={onPrevious}
            disabled={isSubmitting}
          >
            ← Back to Images
          </button>
          <button 
            type="button" 
            className="submit-button"
            onClick={onSubmit}
            disabled={isSubmitting || images.length === 0}
          >
            {isSubmitting ? 'Adding Product...' : '📝 Complete & Add Product'}
          </button>
        </div>
      </div>

      {/* Manual Mask Modal */}
      {showManualMaskModal && selectedImageIndex !== null && (
        <div className="manual-mask-modal">
          <div className="manual-mask-modal-content">
            <div className="manual-mask-modal-header">
              <h3>Create Manual Mask</h3>
              <button 
                className="manual-mask-modal-close"
                onClick={handleManualMaskCancel}
              >
                ×
              </button>
            </div>            
            <div className="manual-mask-modal-body">
              <MaskDrawingApp 
                imageUrl={images[selectedImageIndex].base64Data}
                onMaskComplete={handleManualMaskComplete}
                onCancel={handleManualMaskCancel}
                isModal={true}
                returnStep={4}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Mask Preview Modal */}
      {showMaskPreviewModal && (
        <div className="mask-preview-modal">
          <div className="mask-preview-content">
            <h3>Mask Preview</h3>
            <img 
              src={previewMaskSrc} 
              alt="Mask Preview" 
              className="mask-preview-image" 
              onContextMenu={e => e.preventDefault()} 
              draggable={false}
            />
            <div className="mask-preview-actions">
              <button 
                className="mask-preview-close"
                onClick={closeMaskPreview}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Limit Modal */}
      {showImageLimitModal && (
        <div className="image-limit-modal">
          <div className="image-limit-modal-content">
            <h3>Maximum 5 Images Allowed</h3>
            <p>Select up to 5 images to keep. Unselected images will be removed.</p>
            <div className="image-limit-selection-grid">
              {[...generatedImages, ...pendingImagesToAdd].map((img, idx) => {
                const isSelected = imageLimitSelection.includes(idx);
                return (
                  <div
                    key={img.id}
                    className={`image-limit-selection-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      if (isSelected) {
                        setImageLimitSelection(imageLimitSelection.filter(i => i !== idx));
                      } else if (imageLimitSelection.length < 5) {
                        setImageLimitSelection([...imageLimitSelection, idx]);
                      }
                    }}
                    style={{ cursor: 'pointer', border: isSelected ? '2px solid #4caf50' : '2px solid #ccc', margin: 8, padding: 10 }}
                  >
                    <img src={img.base64Data} alt={img.name} style={{ width: 170, height: 170, objectFit: 'cover', borderRadius: 6 }} />
                    <div style={{ marginTop: 20, textAlign: 'center', fontSize: 15, fontFamily: 'DM Sans:Medium, sans-serif' }}>{img.name}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 50, textAlign: 'center' }}>
              <button
                className="modal-confirm-btn"
                disabled={imageLimitSelection.length !== 5}
                onClick={() => {
                  const allImages = [...generatedImages, ...pendingImagesToAdd];
                  setGeneratedImages(imageLimitSelection.map(idx => allImages[idx]));
                  setShowImageLimitModal(false);
                  setPendingImagesToAdd([]);
                  setImageLimitSelection([]);
                }}
              >
                Keep Selected ({imageLimitSelection.length}/5)
              </button>
              <button
                className="modal-cancel-btn"
                onClick={() => {
                  setShowImageLimitModal(false);
                  setPendingImagesToAdd([]);
                  setImageLimitSelection([]);
                }}
                style={{ marginLeft: 12 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomizationStep;