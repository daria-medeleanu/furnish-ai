import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, RotateCcw, Eye, Check, X } from 'lucide-react';
import Navbar from '../../components/navbar/Navbar'
import "./manualMask.css"

export default function MaskDrawingApp({ 
  imageUrl: propImageUrl, 
  returnStep = 4, 
  onMaskComplete = null, 
  onCancel = null,
  isModal = false 
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const imageUrl = propImageUrl || location.state?.imageUrl;
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);
  const [bgWidth, setBgWidth] = useState(768);
  const [bgHeight, setBgHeight] = useState(768);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [maskGenerated, setMaskGenerated] = useState(false);  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);

  const getReturnDestination = () => {
    const isFromProductCustomize = location.state?.returnToProductCustomize;
    const isFromAddProduct = location.state?.isFromAddProduct;
    
    console.log('Navigation debug:', {
      isFromProductCustomize,
      isFromAddProduct,
      locationState: location.state
    });
    
    if (isFromProductCustomize || isFromAddProduct) {
      return '/add';
    }
    return '/customize';
  };

  const getResizedDims = (width, height, maxSize = 768) => {
    let newWidth = width;
    let newHeight = height;
    if (width > height) {
      if (width > maxSize) {
        newHeight = Math.round(height * maxSize / width);
        newWidth = maxSize;
      }
    } else {
      if (height > maxSize) {
        newWidth = Math.round(width * maxSize / height);
        newHeight = maxSize;
      }
    }
    newWidth = Math.floor(newWidth / 8) * 8;
    newHeight = Math.floor(newHeight / 8) * 8;
    return { width: newWidth, height: newHeight };
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.selectedCategoryTitle) {
        setSelectedCategoryTitle(location.state.selectedCategoryTitle);
      }
      if (location.state.imageUrl || location.state.selectedFileDataUrl) {
        setOriginalImageUrl(location.state.imageUrl || location.state.selectedFileDataUrl);
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (imageLoaded && canvasRef.current) {
      initializeCanvas();
    }
  }, [bgWidth, bgHeight, imageLoaded]);

  useEffect(() => {
    if (canvasRef.current && points.length > 0) {
      drawContour();
    }
  }, [points, isPolygonClosed]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = bgWidth;
    canvas.height = bgHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, bgWidth, bgHeight);
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleCanvasClick = (e) => {
    if (isPolygonClosed) return;
    
    const coords = getCanvasCoordinates(e);
    
    if (points.length > 2) {
      const firstPoint = points[0];
      const distance = Math.sqrt(
        Math.pow(coords.x - firstPoint.x, 2) + Math.pow(coords.y - firstPoint.y, 2)
      );
      
      if (distance < 15) {
        setIsPolygonClosed(true);
        return;
      }
    }
    
    setPoints(prev => [...prev, coords]);
  };

  const drawContour = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (points.length === 0) return;
    
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    if (isPolygonClosed) {
      ctx.closePath();
    }
    
    ctx.stroke();
    
    points.forEach((point, index) => {
      ctx.fillStyle = index === 0 ? '#00ff00' : '#ff0000';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    if (!isPolygonClosed && points.length > 0) {
    }
  };

  const generateMask = () => {
    console.log('Generate mask called', { isPolygonClosed, pointsLength: points.length });
    
    if (!isPolygonClosed || points.length < 3) {
      console.log('Cannot generate mask: polygon not closed or insufficient points');
      return;
    }
    
    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas) {
      console.log('Preview canvas not found');
      return;
    }
    
    console.log('Setting canvas dimensions:', bgWidth, 'x', bgHeight);
    previewCanvas.width = bgWidth;
    previewCanvas.height = bgHeight;
    
    const ctx = previewCanvas.getContext('2d');
    
    ctx.clearRect(0, 0, bgWidth, bgHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, bgWidth, bgHeight);
    console.log('White background filled');
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.closePath();
    ctx.fill();
    console.log('Black polygon filled with points:', points);
    
    setMaskGenerated(true);
    setShowPreview(true);
    console.log('Mask generated and preview enabled');
  };

  const clearPoints = () => {
    setPoints([]);
    setIsPolygonClosed(false);
    setMaskGenerated(false);
    setShowPreview(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const undoLastPoint = () => {
    if (points.length === 0) return;
    
    if (isPolygonClosed) {
      setIsPolygonClosed(false);
    } else {
      setPoints(prev => prev.slice(0, -1));
    }
  };

  const downloadMask = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !maskGenerated) return;
    
    const link = document.createElement('a');
    link.download = 'mask.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleImageLoad = (e) => {
    const img = e.target;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });

    let { width, height } = getResizedDims(naturalWidth, naturalHeight, 768);
    setBgWidth(width);
    setBgHeight(height);
    setImageLoaded(true);
  };

  const calculateDisplayDimensions = () => {
    const containerWidth = 800;
    const containerHeight = 600;
    
    let displayWidth = bgWidth;
    let displayHeight = bgHeight;
    
    const scaleX = containerWidth / bgWidth;
    const scaleY = containerHeight / bgHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    
    displayWidth = bgWidth * scale;
    displayHeight = bgHeight * scale;
    
    return { width: displayWidth, height: displayHeight };
  };

  const displayDimensions = calculateDisplayDimensions();
  return (
    <div className="manual-mask-container">
      {!isModal && <Navbar page={"inspire"}/>}
      <div className="manual-mask-wrapper">
        <div className="manual-mask-content">
          <div className="title-wrapper">
            <div className="title">
              Manual Mask Menu
            </div>
            {!isModal && (
              <button className="back-button" onClick={() => {
                if (onCancel) {
                  onCancel();
                } else {
                  const destination = getReturnDestination();
                  
                  if (destination === '/add') {
                    navigate('/add', {
                      state: {
                        step: returnStep,
                        returnFromManualMask: true
                      }
                    });
                  } else {
                    navigate('/customize', {
                      state: {
                        selectedCategoryTitle,
                        selectedFileDataUrl: originalImageUrl,
                        selectedImageIndex: location.state?.selectedImageIndex,
                        images: location.state?.images,
                        categoryName: location.state?.categoryName,
                        returnFromManualMask: true
                      }
                    });
                  }
                }
              }}>← Back</button>
            )}
          </div>
          
          <div style={{ marginBottom: 16, color: '#666' }}>
            Click points around the object contour. Click near the first point to close the shape.
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <button
              onClick={undoLastPoint}
              disabled={points.length === 0}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
                backgroundColor: 'white',
                cursor: points.length === 0 ? 'not-allowed' : 'pointer',
                opacity: points.length === 0 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <RotateCcw size={16} />
              Undo Point
            </button>
            
            <button
              onClick={generateMask}
              disabled={!isPolygonClosed}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #485c11',
                backgroundColor: isPolygonClosed ? '#485c11' : '#ccc',
                color: 'white',
                cursor: isPolygonClosed ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Eye size={16} />
              Generate Mask
            </button>            
            {maskGenerated && (
              <button
                onClick={() => {
                  const maskDataUrl = previewCanvasRef.current.toDataURL();
                  
                  if (isModal && onMaskComplete) {
                    onMaskComplete(maskDataUrl);
                  } else {
                    
                    const destination = getReturnDestination();
                    if (destination === '/add') {
                      navigate('/add', {
                        state: {
                          manualMask: maskDataUrl,
                          returnFromManualMask: true,
                          step: returnStep
                        }
                      });
                    } else {
                      navigate('/customize', {
                        state: {
                          manualMask: maskDataUrl,
                          selectedCategoryTitle,
                          selectedFileDataUrl: originalImageUrl,
                          returnFromManualMask: true,
                          selectedImageIndex: location.state?.selectedImageIndex,
                          images: location.state?.images,
                          categoryName: location.state?.categoryName,
                          preserveCustomizeState: true
                        }
                      });
                    }
                  }
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #485c11',
                  backgroundColor: '#485c11',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Check size={16} />
                {isModal ? 'Save Mask' : 'Save Mask & Return'}
              </button>
            )}
            {maskGenerated && (
              <>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #007acc',
                    backgroundColor: showPreview ? '#007acc' : 'white',
                    color: showPreview ? 'white' : '#007acc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  {showPreview ? <X size={16} /> : <Eye size={16} />}
                  {showPreview ? 'Hide Preview' : 'Preview Mask'}
                </button>
                
                <button
                  onClick={downloadMask}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #28a745',
                    backgroundColor: '#28a745',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Download size={16} />
                  Download Mask
                </button>
              </>
            )}
          </div>

          <div style={{ marginBottom: 16, padding: 8, backgroundColor: '#f0f4e8', borderRadius: 6, fontSize: 14 }}>
            <strong>Status:</strong> {points.length} points marked
            {isPolygonClosed && ' • Polygon closed'}
            {maskGenerated && ' • Mask ready for download'}
          </div>

          <div className="canvas-wrapper" ref={containerRef}>
            <div style={{ 
              position: 'relative', 
              width: displayDimensions.width,
              height: displayDimensions.height,
              margin: '0 auto',
              border: '2px dashed #ccc'
            }}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Mask Source"
                  onLoad={handleImageLoad}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: 8,
                    opacity: showPreview ? 0.3 : 0.7
                  }}
                />
              )}
              
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  cursor: isPolygonClosed ? 'default' : 'crosshair',
                  borderRadius: 8,
                  backgroundColor: 'transparent'
                }}
                onClick={handleCanvasClick}
              />
              
              <canvas
                ref={previewCanvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: 8,
                  opacity: showPreview && maskGenerated ? 0.8 : 0,
                  pointerEvents: 'none',
                  border: showPreview && maskGenerated ? '2px solid red' : 'none',
                  zIndex: 10,
                  visibility: maskGenerated ? 'visible' : 'hidden'
                }}
              />
            </div>
            
            {!imageUrl && (
              <div style={{ 
                color: '#888', 
                textAlign: 'center', 
                padding: '40px 0',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
                No image provided - Click to mark contour points
              </div>
            )}
          </div>
          
          <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8, fontSize: 14 }}>
            <strong>Instructions:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>Click around the object's contour to mark points</li>
              <li>The first point will be <span style={{color: '#00ff00'}}>green</span>, others will be <span style={{color: '#ff0000'}}>red</span></li>
              <li>Click near the first point (green) to close the polygon</li>
              <li>Generate mask to create the final mask</li>
              <li>Preview the mask before downloading</li>
              <li>Final dimensions: {bgWidth} × {bgHeight} pixels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}