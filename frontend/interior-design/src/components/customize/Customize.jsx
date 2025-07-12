import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './customize.css'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip'
import MaskDrawingApp from '../../pages/manualMaskPage/manualMask';
import Navbar from '../navbar/Navbar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PromptMenu from '../promptMenu/promptMenu'

const Customize = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageError, setImageError] = useState('');
    const [manualMask, setManualMask] = useState('');
    const [finalPrompt, setFinalPrompt] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultImage, setResultImage] = useState(null);
    const [apiError, setApiError] = useState('');
    const [showManualMaskModal, setShowManualMaskModal] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState("blurry, bad quality, distorted, ugly, cluttered, messy, poor lighting, low resolution, busy background");
    const [numInferenceSteps, setNumInferenceSteps] = useState(25);
    const [guidanceScale, setGuidanceScale] = useState(7.5);
    const [seed, setSeed] = useState(-1);
    const [isGeneratingResult, setIsGeneratingResult] = useState(false);
    const [customizationResult, setCustomizationResult] = useState(null);
    const [customizationError, setCustomizationError] = useState('');

    const handleInpaintImage = async () => {
      if (!selectedFile || !manualMask || !customPrompt) {
        setCustomizationError('Please upload an image, create a mask, and provide a prompt.');
        return;
      }

      try {
        setIsGeneratingResult(true);
        setCustomizationError('');
        setCustomizationResult(null);

        const originalImageFile = selectedFile.file || base64ToFile(selectedFile.dataUrl, selectedFile.name, selectedFile.type);

        const maskResponse = await fetch(manualMask);
        const maskBlob = await maskResponse.blob();
        const maskImageFile = new File([maskBlob], 'mask.png', { type: 'image/png' });

        const formData = new FormData();
        formData.append('OriginalImage', originalImageFile);
        formData.append('MaskImage', maskImageFile);
        formData.append('Prompt', customPrompt);
        formData.append('NegativePrompt', negativePrompt);
        formData.append('NumInferenceSteps', numInferenceSteps);
        formData.append('GuidanceScale', guidanceScale);
        formData.append('Seed', seed);

        const token = Cookies.get('token');
        const response = await fetch('http://localhost:5029/api/v1/ImageProcess/inpaint', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to generate customized image');
        }

        const resultBlob = await response.blob();
        const resultUrl = URL.createObjectURL(resultBlob);
        setCustomizationResult(resultUrl);
      } catch (error) {
        setCustomizationError(error.message || 'Failed to generate customized image');
      } finally {
        setIsGeneratingResult(false);
      }
    };
      
    const handleManualMaskNavigation = () => {
      setShowManualMaskModal(true);
    };

    const handleManualMaskComplete = (maskDataUrl) => {
      setManualMask(maskDataUrl);
      setShowManualMaskModal(false);
    };

    const handleManualMaskCancel = () => {
      setShowManualMaskModal(false);
    };

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get('step');
      if (stepParam) {
        setStep(parseInt(stepParam));
      }

      if (location.state?.manualMask) {
        setManualMask(location.state.manualMask);
        setStep(3);
      }

      if (location.state?.selectedFileDataUrl) {
        const restoredFile = {
          name: 'image.png',
          type: 'image/png',
          dataUrl: location.state.selectedFileDataUrl,
        };
        setSelectedFile(restoredFile);
      }

      window.history.replaceState({}, document.title);
    }, [location.state]);

    useEffect(() => {
      const params = new URLSearchParams();
      if (step > 1) params.set('step', step.toString());
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    }, [step]);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setImageError('Only JPG, JPEG, PNG, and WEBP images are allowed.');
        e.target.value = null;
        setSelectedFile(null);
        return;
      }

      if (file.size > maxSize) {
        setImageError('Image size must be less than 5MB.');
        e.target.value = null;
        setSelectedFile(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedFile({
          name: file.name,
          type: file.type,
          size: file.size,
          file: file,
          dataUrl: URL.createObjectURL(file),
          base64Data: event.target.result, 
        });
      };
      reader.readAsDataURL(file);
      setImageError('');
    };

    const handlePromptGenerated = (prompt) => {
      setFinalPrompt(prompt);
      setCustomPrompt(prompt);
    };    
      
    const getImageSrc = (file) => {
      if (!file) return undefined;
      if (file.dataUrl) return file.dataUrl;
      if (file.file) return URL.createObjectURL(file.file);
      
      if (isFromAddProduct && file.originalIndex !== undefined && addProductImages && addProductImages[file.originalIndex]) {
        const actualFile = addProductImages[file.originalIndex];
        return actualFile.base64Data ? actualFile.base64Data : URL.createObjectURL(actualFile);
      }
      
      if (file.base64Data) {
        return file.base64Data;
      }
      
      return URL.createObjectURL(file);
    };

    const handleBackToHome = () => {
      navigate('/home');
    };


    return (
    <div className="container">
      <Navbar page={"home"} />
      <div className="wrapper-customize">
        <div className="left-side-customize">
          <button
            className="back-to-prev-btn-product-page"
            onClick={handleBackToHome}
          >
            ← Back to home
          </button>

        </div>
        <div className="content">
          <div className="title-wrapper">
            <h1 className="title">Customize Your Product Background</h1>
          </div>
          {step === 1 && (
            <div className="steps-container">
              <div className="steps-wrapper">
                <div className="steps-nr">1</div>
                <h3 className="steps-title">Upload Your Image (one file only)</h3>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleImageChange}
                className="file-input"
              />
              {imageError && <div className="image-error">{imageError}</div>}
              {selectedFile && (
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={selectedFile.dataUrl || URL.createObjectURL(selectedFile.file)}
                    alt="Preview"
                    style={{ maxHeight: 300, maxWidth: '100%', borderRadius: 12, border: '1px solid #ccc' }}
                  />
                </div>
              )}
            </div>
          )}
          {step === 2 && (
            <div className="steps-container">
              <div className="steps-wrapper">
                <div className="steps-nr">2</div>
                <h3 className="steps-title">Generate Object Mask</h3>
              </div>
              <button onClick={handleManualMaskNavigation} className="button mask-button-manual">
                Generate Mask Manually
              </button>
              {manualMask && (
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <img src={manualMask} alt="Manual Mask" style={{ maxWidth: 300, borderRadius: 8 }} />
                </div>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="steps-container">
              <div className="steps-wrapper">
                <div className="steps-nr">4</div>
                <h3 className="steps-title">Generate AI Background</h3>
              </div>
              
              <PromptMenu onPromptGenerated={handlePromptGenerated} />
              
              {finalPrompt && (
                <div style={{ marginTop: 24, background: '#f9fafb', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Saved Prompt:</div>
                  <div style={{ fontFamily: 'monospace', color: '#374151' }}>{finalPrompt}</div>
                </div>
              )}

              {customPrompt && manualMask && selectedFile && (
                <div className="customization-section" style={{ marginTop: 24 }}>
                  <h3>Generate AI Background</h3>
                  <div className="generation-summary" style={{ marginBottom: 16, padding: 12, background: '#f0f9ff', borderRadius: 8 }}>
                    <div><strong>Selected Image:</strong> {selectedFile.name}</div>
                    <div><strong>Mask:</strong> Manual Created</div>
                    <div><strong>Prompt:</strong> {customPrompt}</div>
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
                  
                  {customizationError && <div className="customization-error">{customizationError}</div>}
                  
                  {customizationResult && (
                    <div className="result-section">
                      <h4>Generated Result</h4>
                      <img
                        src={customizationResult}
                        alt="Customized Result"
                        className="result-image"
                        style={{ cursor: 'pointer' }}
                        onClick={() => window.open(customizationResult, '_blank')}
                      />
                    </div>
                  )}
                </div>
              )}

              {(!customPrompt || !manualMask || !selectedFile) && (
                <div style={{ marginTop: 16, padding: 12, background: '#fff3cd', borderRadius: 8, color: '#856404' }}>
                  <strong>Requirements:</strong>
                  <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                    <li>{selectedFile ? '✓' : '✗'} Upload an image (Step 1)</li>
                    <li>{manualMask ? '✓' : '✗'} Create a mask (Step 2)</li>
                    <li>{customPrompt ? '✓' : '✗'} Generate a prompt (Step 3)</li>
                  </ul>
                  {!selectedFile && <p>Please go back to Step 1 to upload an image.</p>}
                  {!manualMask && <p>Please go back to Step 2 to create a mask.</p>}
                  {!customPrompt && <p>Please use the prompt generator above.</p>}
                </div>
              )}
            </div>
          )}
          {customPrompt && manualMask && (
            <div className="customization-section">
              <h3>Generate AI Background</h3>
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
              {customizationError && <div className="customization-error">{customizationError}</div>}
              {customizationResult && (
                <div className="result-section">
                  <h4>Generated Result</h4>
                  <img
                    src={customizationResult}
                    alt="Customized Result"
                    className="result-image"
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.open(customizationResult, '_blank')}
                  />
                </div>
              )}
            </div>
          )}
          {showManualMaskModal && (
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
                    imageUrl={selectedFile?.base64Data }
                    onMaskComplete={handleManualMaskComplete}
                    onCancel={handleManualMaskCancel}
                    isModal={true}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="navigation-buttons-wrapper">
            {step > 1 && (
              <button className="button back-button-nav" onClick={() => setStep(step - 1)}>
                <ArrowBackIcon />
              </button>
            )}
            {step < 4 && (
              <button className="button" onClick={() => setStep(step + 1)}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;