import React, { useState, useEffect } from 'react';
import { Palette, Lightbulb, Eye, Copy, RotateCcw, Sparkles } from 'lucide-react';
import './promptMenu.css';

const PromptMenu = ({ onPromptGenerated }) => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTextures, setSelectedTextures] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [livePrompt, setLivePrompt] = useState('');
  const [finalPrompt, setFinalPrompt] = useState('');

  const styles = [
    { id: 'traditional', name: 'Traditional', desc: 'Classic furniture, antique, rich fabrics, timeless elegance' },
    { id: 'modern', name: 'Modern Minimalist', desc: 'Clean lines, neutral colors, uncluttered spaces' },
    { id: 'scandinavian', name: 'Scandinavian', desc: 'Light woods, cozy textures, hygge atmosphere' },
    { id: 'industrial', name: 'Industrial', desc: 'Exposed brick, metal fixtures, raw materials' },
    { id: 'boho', name: 'Bohemian', desc: 'Eclectic patterns, rich textures, global influences' },
    { id: 'contemporary', name: 'Contemporary', desc: 'Current trends, mixed materials, sophisticated' },
    { id: 'rustic', name: 'Rustic', desc: 'Natural wood, stone accents, countryside charm' },
    { id: 'artdeco', name: 'Art Deco', desc: 'Geometric patterns, luxurious materials, glamour' }
  ];

  const moods = [
    { id: 'cozy', name: 'Cozy & Warm', desc: 'Inviting and comfortable atmosphere' },
    { id: 'elegant', name: 'Elegant & Sophisticated', desc: 'Refined and luxurious feeling' },
    { id: 'bright', name: 'Bright & Airy', desc: 'Light-filled and spacious' },
    { id: 'dramatic', name: 'Dramatic & Bold', desc: 'Strong contrasts and statement pieces' },
    { id: 'serene', name: 'Serene & Calm', desc: 'Peaceful and relaxing environment' },
    { id: 'vibrant', name: 'Vibrant & Energetic', desc: 'Lively and stimulating space' }
  ];

  const colors = [
    { id: 'neutral', name: 'Neutral Palette', desc: 'Whites, grays, beiges' },
    { id: 'earth', name: 'Earth Tones', desc: 'Browns, terracotta, ochre' },
    { id: 'cool', name: 'Cool Blues & Greens', desc: 'Calming blue and green hues' },
    { id: 'warm', name: 'Warm Reds & Oranges', desc: 'Energizing warm colors' },
    { id: 'monochrome', name: 'Monochromatic', desc: 'Single color variations' },
    { id: 'jewel', name: 'Jewel Tones', desc: 'Rich emerald, sapphire, ruby' }
  ];

  const textures = [
    { id: 'smooth', name: 'Smooth & Polished', desc: 'Glossy surfaces, marble, glass' },
    { id: 'rough', name: 'Rough & Textured', desc: 'Brick, stone, raw wood' },
    { id: 'soft', name: 'Soft & Fabric', desc: 'Velvet, linen, wool textures' },
    { id: 'metallic', name: 'Metallic Accents', desc: 'Gold, silver, copper finishes' },
    { id: 'natural', name: 'Natural Materials', desc: 'Wood grain, stone patterns' }
  ];

  const handleColorToggle = (colorId) => {
    setSelectedColors(prev => {
      const newArr = prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId];
      buildLivePrompt(selectedStyle, selectedMood, newArr, selectedTextures);
      return newArr;
    });       
  };

  const handleTextureToggle = (textureId) => {
    setSelectedTextures(prev => {
      const newArr = prev.includes(textureId)
        ? prev.filter(id => id !== textureId)
        : [...prev, textureId];
      buildLivePrompt(selectedStyle, selectedMood, selectedColors, newArr);
      return newArr;
    });
  };

  const buildLivePrompt = (
    style = selectedStyle,
    mood = selectedMood,
    colorsArr = selectedColors,
    texturesArr = selectedTextures
  ) => {
    const parts = [];
    if (style) {
      const s = styles.find(st => st.id === style);
      if (s) parts.push(`${s.name.toLowerCase()} interior design`);
    }
    if (mood) {
      const m = moods.find(md => md.id === mood);
      if (m) parts.push(`${m.name.toLowerCase()} atmosphere`);
    }
    if (colorsArr.length > 0) {
      const colorNames = colorsArr.map(id => colors.find(c => c.id === id).name.toLowerCase());
      parts.push(`${colorNames.join(' and ')} color scheme`);
    }
    if (texturesArr.length > 0) {
      const textureNames = texturesArr.map(id => textures.find(t => t.id === id).name.toLowerCase());
      parts.push(`${textureNames.join(' and ')} textures`);
    }
    setLivePrompt(parts.join(', '));
  };

  useEffect(() => {
    buildLivePrompt();
  }, [selectedStyle, selectedMood, selectedColors, selectedTextures]);

  const generatePrompt = () => {
    const parts = [];
    
    if (selectedStyle) {
      const style = styles.find(s => s.id === selectedStyle);
      parts.push(`${style.name.toLowerCase()} interior design`);
    }
    
    if (selectedMood) {
      const mood = moods.find(m => m.id === selectedMood);
      parts.push(`${mood.name.toLowerCase()} atmosphere`);
    }
    
    if (selectedColors.length > 0) {
      const colorNames = selectedColors.map(id => colors.find(c => c.id === id).name.toLowerCase());
      parts.push(`${colorNames.join(' and ')} color scheme`);
    }
    
    if (selectedTextures.length > 0) {
      const textureNames = selectedTextures.map(id => textures.find(t => t.id === id).name.toLowerCase());
      parts.push(`${textureNames.join(' and ')} textures`);
    }
    
    if (additionalDetails.trim()) {
      parts.push(additionalDetails.trim());
    }
    
    parts.push('high quality', 'professional interior photography', 'well-composed', 'detailed background');
    
    const prompt = parts.join(', ');
    setFinalPrompt(prompt);
    if (onPromptGenerated) onPromptGenerated(prompt);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(finalPrompt);
  };

  const resetAll = () => {
    setSelectedStyle('');
    setSelectedMood('');
    setSelectedColors([]);
    setSelectedTextures([]);
    setAdditionalDetails('');
    setFinalPrompt('');
  };

  return (
    <div className="prompt-menu-container">
      <div className="prompt-menu-card">
        <div className="prompt-menu-section">
          <div className="prompt-menu-section-title">
            <h2 className="prompt-menu-section-title mb-4">What is  you Interior Design Style of choice?</h2>
          </div>
          <div className="prompt-menu-grid prompt-menu-grid-4">
            {styles.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`prompt-menu-btn${selectedStyle === style.id ? ' selected-style' : ''}`}
              >
                <div className="font-semibold text-gray-800">{style.name}</div>
                <div className="text-sm text-gray-600 mt-1">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="prompt-menu-section">
          <div className="prompt-menu-section-title">
            <h2 className="prompt-menu-section-title mb-4">What is the atmosphere like in this space?</h2>
          </div>
          <div className="prompt-menu-grid prompt-menu-grid-3">
            {moods.map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`prompt-menu-btn${selectedMood === mood.id ? ' selected-mood' : ''}`}
              >
                <div className="font-semibold text-gray-800">{mood.name}</div>
                <div className="text-sm text-gray-600 mt-1">{mood.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="prompt-menu-section">
          <h2 className="prompt-menu-section-title mb-4">What kind of colors can you find there? (Select Multiple)</h2>
          <div className="prompt-menu-grid prompt-menu-grid-3">
            {colors.map(color => (
              <button
                key={color.id}
                onClick={() => handleColorToggle(color.id)}
                className={`prompt-menu-btn${selectedColors.includes(color.id) ? ' selected-color' : ''}`}
              >
                <div className="font-semibold text-gray-800">{color.name}</div>
                <div className="text-sm text-gray-600 mt-1">{color.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="prompt-menu-section">
          <h2 className="prompt-menu-section-title mb-4">What about textures? (Select Multiple)</h2>
          <div className="prompt-menu-grid prompt-menu-grid-5">
            {textures.map(texture => (
              <button
                key={texture.id}
                onClick={() => handleTextureToggle(texture.id)}
                className={`prompt-menu-btn${selectedTextures.includes(texture.id) ? ' selected-texture' : ''}`}
              >
                <div className="font-semibold text-gray-800">{texture.name}</div>
                <div className="text-sm text-gray-600 mt-1">{texture.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="prompt-menu-section">
          <h2 className="prompt-menu-section-title mb-2">Your prompt:</h2>
          <input 
            type="text"
            className="prompt-menu-live-preview"
            contentEditable="false"
            value={livePrompt}
            placeholder="Your selections will appear here.." 
          />
        </div>
        <div className="prompt-menu-section">
          <h2 className="prompt-menu-section-title mb-4">Do you want to add anything in particular? (Optional)</h2>
          <textarea
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="Add specific elements like 'large windows', 'plants', 'artwork on walls', 'wooden floors', etc."
            className="prompt-menu-textarea"
            rows="3"
          />
        </div>

        <div className="prompt-menu-actions">
          <button
            onClick={generatePrompt}
            className="prompt-menu-generate"
          >
            Generate Prompt
          </button>
          <button
            onClick={resetAll}
            className="prompt-menu-reset"
          >
            <RotateCcw style={{width: '1.25rem', height: '1.25rem'}} />
            Reset
          </button>
        </div>

        {/* {finalPrompt && (
          <div className="prompt-menu-promptbox">
            <div className="flex items-center justify-between mb-4">
              <h3 className="prompt-menu-promptbox-title">Your Generated Prompt</h3>
              <button
                onClick={copyPrompt}
                className="prompt-menu-copy"
              >
                <Copy style={{width: '1rem', height: '1rem'}} />
                Copy
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 font-mono text-sm text-gray-700 leading-relaxed">
              {finalPrompt}
            </div>
            <div className="prompt-menu-tip">
              <strong>Tip:</strong> Use this prompt with your inpainting model to generate a beautiful background that complements your furniture while maintaining the existing pieces.
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default PromptMenu;