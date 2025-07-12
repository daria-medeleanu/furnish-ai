import { useState } from 'react';
import { convertFileToBase64, uploadToCloudinary } from '../utils/imageUtils';

export const useImageManagement = () => {
  const [images, setImages] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showImageLimitModal, setShowImageLimitModal] = useState(false);
  const [imageLimitSelection, setImageLimitSelection] = useState([]);
  const [pendingImagesToAdd, setPendingImagesToAdd] = useState([]);

  const handleImageChange = async (files) => {
    if (files.length > 5) {
      throw new Error(`Maximum 5 images allowed. You selected ${files.length} images.`);
    }

    const serializableImages = await Promise.all(
      files.map(async (file) => {
        const base64 = await convertFileToBase64(file);
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          base64Data: base64,
          originalFile: file
        };
      })
    );

    setImages(serializableImages);
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const addGeneratedImage = async (imageData) => {
    let serializableImage;
    
    if (typeof imageData === 'object' && imageData.base64Data) {
      serializableImage = {
        ...imageData,
        id: Date.now() + Math.random(),
        name: imageData.name || `generated-image-${generatedImages.length + 1}.png`
      };
    } else {
      const imageUrl = typeof imageData === 'string' ? imageData : imageData.originalUrl;
      if (!imageUrl) return;
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `generated-image-${generatedImages.length + 1}.png`, { type: blob.type });
      const base64 = await convertFileToBase64(file);
      
      serializableImage = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        base64Data: base64,
        originalFile: null
      };
    }

    if (generatedImages.length + 1 > 5) {
      setPendingImagesToAdd([serializableImage]);
      setImageLimitSelection(generatedImages.map((_, idx) => idx));
      setShowImageLimitModal(true);
      return;
    }

    setGeneratedImages(prev => [...prev, serializableImage]);
  };

  const removeGeneratedImage = (indexToRemove) => {
    setGeneratedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const uploadAllImages = async () => {
    setUploading(true);
    try {
      const imageUrls = [];
      const generatedImageUrls = [];

      for (let imgObj of images) {
        const file = imgObj.originalFile || base64ToFile(imgObj.base64Data, imgObj.name, imgObj.type);
        const url = await uploadToCloudinary(file);
        if (url) imageUrls.push(url);
      }

      for (let imgObj of generatedImages) {
        const file = base64ToFile(imgObj.base64Data, imgObj.name, imgObj.type);
        const url = await uploadToCloudinary(file);
        if (url) generatedImageUrls.push(url);
      }

      return [...generatedImageUrls, ...imageUrls];
    } finally {
      setUploading(false);
    }
  };

  return {
    images, setImages,
    generatedImages, setGeneratedImages,
    uploading,
    showImageLimitModal, setShowImageLimitModal,
    imageLimitSelection, setImageLimitSelection,
    pendingImagesToAdd, setPendingImagesToAdd,
    
    handleImageChange,
    removeImage,
    addGeneratedImage,
    removeGeneratedImage,
    uploadAllImages,
  };
};