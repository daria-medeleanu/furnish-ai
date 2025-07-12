import { useState, useEffect } from 'react';
import './productCustomize.css'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip'
import Navbar from '../navbar/Navbar'
import WeekendIcon from '@mui/icons-material/Weekend';
import ChairIcon from '@mui/icons-material/Chair';
import TableBarIcon from '@mui/icons-material/TableBar';
import DeskIcon from '@mui/icons-material/Desk';
import HotelIcon from '@mui/icons-material/Hotel';
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import PromptMenu from '../promptMenu/promptMenu'
import { Client,  handle_file } from "@gradio/client";

const ProductCustomize = ({imageFile, onComplete, onBack}) => {
  const [step, setStep] = useState(1);
  const [showManualMask, setShowManualMask] = useState(false);
  const [manualMask, setManualMask] = useState(null);
  const [autoMask, setAutoMask] = useState(null);
  const [selectedMaskType, setSelectedMaskType] = useState(null); 
  const [imageDisplaySize, setImageDisplaySize] = useState({ width: 400, height: 300 });
  const [finalPrompt, setFinalPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingAutoMask, setIsGeneratingAutoMask] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [apiError, setApiError] = useState("");
  const [generatedImages, setGeneratedImages] = useState([]);
  const navigate = useNavigate();

  const createFileFromDataUrl = (dataUrl, fileName = 'image.png') => {
    return {
      name: fileName,
      type: 'image/png',
      dataUrl: dataUrl,
      size: Math.round((dataUrl.length * 3) / 4) 
    };
  };

  const getImageSrc = (file) => {
    if (!file) return undefined;
    if (file.dataUrl) return file.dataUrl;
    return URL.createObjectURL(file);
  };

  const getSelectedMask = () => {
    return selectedMaskType === 'auto' ? autoMask : manualMask;
  };

  const handleGenerateAutoMask = async () => {

  };

  const handleManualMaskNavigation = () => {
    if (!imageFile) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      navigate('/manual-mask', {
        state: {
          imageUrl,
          returnToProductCustomize: true
        }
      });
    };
    reader.readAsDataURL(imageFile);
  };

  const handlePromptGenerated = (prompt) => {
    setFinalPrompt(prompt);
  };
  
  const handleInpaintImage = async () => {
    try {
      setIsProcessing(true);
      setApiError("");
      setResultImage(null);

      const selectedFile = getSelectedFile();
      if (!selectedFile) {
        throw new Error('No image selected');
      }

      const maskResponse = await fetch(manualMask);
      const maskBlob = await maskResponse.blob();
      const maskImageFile = new File([maskBlob], 'mask.png', { type: 'image/png' });

      const client = await Client.connect("dariaMed/inpaint-test", {
        hf_token: hf_token,
      });
      console.log("Client connected successfully");

      const result = await client.predict("/inpaint_image", {
        original_image: selectedFile,
        mask_image: maskImageFile,
        prompt: finalPrompt,
        negative_prompt: "",
        num_inference_steps: 25,
        guidance_scale: 7.5,
        seed: -1,
      });

      console.log("API call completed:", result);
      if (result && result.data && result.data[0] && result.data[0].url) {
        setResultImage(result.data[0].url);
        setGeneratedImages(prev => [...prev, result.data[0].url]);
      }
      setIsProcessing(false);
      return result.data;
    } catch (error) {
      setApiError(error.message || 'An error occurred');
      setIsProcessing(false);
      console.error("Error in handleInpaintImage:", error);
      throw error;
    }
  };

  const handleSaveAndReturn = () => {
    navigate('/add', {
      state: {
        generatedImages: generatedImages
      }
    });
  };

  return (
    <div className="container">
      <Navbar page={"inspire"}/>
      <div className="wrapper-customize">
        <div className="content">
          <div className="title-wrapper">
            <h1 className="title">
              Customize Product Background
            </h1>
            <button
              onClick={() => {
                if (step === 1) {
                  navigate('/add');
                } else {
                  setStep(1);
                }
              }}
              className="back-button"
            >
              ← {step === 1 ? 'Back to Add Product' : 'Back to Overview'}
            </button>
          </div>
          
          {step === 1 && (
            <div className="steps-container">
              <div className="steps-wrapper">
                <div className="steps-nr">1</div>
                <h3 className="steps-title">Image Preview</h3>
              </div>
              
              <div className="image-preview-wrapper">
                <h4 className="image-preview-title">Your Image:</h4>
                <img
                  src={getImageSrc(imageFile)}
                  alt="Product to customize"
                  className="image-preview"
                />
              </div>
              
              <p className="step-description">
                This is the image that will be customized with AI background generation.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="steps-container">
              <div className="steps-wrapper">
                <div className="steps-nr">2</div>
                <h3 className="steps-title">Generate Object Mask</h3>
              </div>
              
              <div className="image-preview-step2">
                <img
                  src={getImageSrc(imageFile)}
                  alt="Image to mask"
                  className="image-preview"
                />
              </div>
              
              <p className="step-description">
                Create a precise mask to isolate your furniture from the background using manual editing tools.
              </p>
              
              <div className="mask-auto-button-wrapper">
                <button
                  className="button mask-auto-button"
                  type="button"
                  onClick={handleGenerateAutoMask}
                >
                  {isGeneratingAutoMask ? (
                    <>
                      <div className="generating-title">
                        Generating..
                      </div>
                    </>
                  ) : (
                    <>
                      <span>🤖</span>
                      {autoMask ? 'Regenerate Auto Mask' : 'Generate Auto Mask'}
                    </>
                  )}
                </button>
                
                <button
                  className="button mask-manual-button"
                  type="button"
                  onClick={handleManualMaskNavigation}
                >
                  <span>✏️</span>
                  {manualMask ? 'Edit Manual Mask' : 'Create Manual Mask'}
                </button>

              </div>
              
              {(autoMask || manualMask) && (
                <div className="mt-32">
                  <h4 className="select-mask">Select Mask to Use:</h4>
                  <div className='select-mask-menu'>
                    {autoMask && (
                      <div 
                        className="select-auto"
                        onClick={() => setSelectedMaskType('auto')}
                      >
                        <div>Auto Generated</div>
                        <img src={autoMask} alt="Auto Mask" className='selected-image-auto' />
                        {selectedMaskType === 'auto' && <div>✓ Selected</div>}
                      </div>
                    )}
                    
                    {manualMask && (
                      <div 
                        className='select-auto'
                        onClick={() => setSelectedMaskType('manual')}
                      >
                        <div>Manual Created</div>
                        <img src={manualMask} alt="Manual Mask" className='selected-image-auto' />
                        {selectedMaskType === 'manual' && <div>✓ Selected</div>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="steps-container">
              <div className="steps-wrapper">
                <div className="steps-nr">3</div>
                <h3 className="steps-title">Customize with Prompts</h3>
              </div>
              
              <p className="step-description">
                Describe your desired background or setting to generate the perfect environment for your furniture.
              </p>
              <PromptMenu onPromptGenerated={handlePromptGenerated}/>
              
              {finalPrompt && (
                <div className="final-prompt-wrapper">
                  <div className='saved-prompt-title'>Saved Prompt:</div>
                  <div className='saved-prompt'>{finalPrompt}</div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="steps-container">
              <div className="steps-wrapper">
                <div className="steps-nr">4</div>
                <h3 className="steps-title">Generate Result</h3>
              </div>
              
              <p className="step-description">
                Review your inputs and generate the final result with AI inpainting.
              </p>
              
              <div className='original-image-preview' >
                <div>
                  <h4>Original Image</h4>
                    <img
                      src={getImageSrc(imageFile)}
                      alt="Original"
                      className='step4-original-image'
                    />
                </div>
                
                <div>
                  <h4>Generated Mask</h4>
                  {getSelectedMask() && (
                    <img
                      src={getSelectedMask()}
                      alt="Mask"
                      className='mask-preview-step4'
                    />
                  )}
                </div>
                
                <div>
                  <h4>Your Prompt</h4>
                  <div className='prompt-preview-step4'>
                    {finalPrompt || "No prompt generated yet"}
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={handleInpaintImage}
                  disabled={!getSelectedMask() || !finalPrompt || isProcessing}
                  className='generate-button'
                >
                  {isProcessing ? (
                    <>
                      <div className='processing'></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>🎨</span>
                      Generate AI Background
                    </>
                  )}
                </button>
              </div>

              {apiError && (
                <div className='api-error'>{apiError}</div>
              )}

              {resultImage && (
                <div className="generated-result-container">
                  <h4 className="generated-result-title">Generated Result</h4>
                  <img
                    src={resultImage.base64Data || resultImage.originalUrl}
                    alt="Generated Result"
                    className="generated-result-image"
                  />
                  {resultImage.hasError && (
                    <div className="generated-result-error">
                      ⚠️ Image generated but may have download limitations
                    </div>
                  )}
                  <div className="generated-result-actions">
                    {resultImage.base64Data && (
                      <a
                        href={resultImage.base64Data}
                        download={resultImage.name || "generated-image.png"}
                        className="generated-result-download"
                      >
                        Download Result
                      </a>
                    )}
                    <button
                      onClick={() => onComplete && onComplete(resultImage)}
                      className="generated-result-use"
                    >
                      Use This Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="navigation-buttons-wrapper">
            {step > 1 && (
              <button className="button back-button-nav" onClick={() => setStep(step - 1)}>
                <ArrowBackIcon />
              </button>
            )}
            {step < 4 && (
              <button 
                className="button" 
                onClick={() => setStep(step + 1)} 
                style={{ marginLeft: step > 1 ? 10 : 0 }}
              >
                {step === 1 && 'Next: Generate Object Mask'}
                {step === 2 && 'Next: Customize with Prompts'}
                {step === 3 && 'Next: Preview & Generate'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomize;