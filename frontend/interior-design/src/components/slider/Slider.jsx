import React, { useState } from 'react'
import './slider.css'

const Slider = ({ sliderImages }) => {
  const [current, setCurrent] = useState(0);

  const maxIndex = sliderImages.length - 1;

  const nextSlide = () => {
    setCurrent((prev) =>
      prev + 1 > maxIndex ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev - 1 < 0 ? maxIndex : prev - 1
    );
  };

  const visibleImages = [
    sliderImages[current],
    sliderImages[(current + 1) % sliderImages.length],
    sliderImages[(current + 2) % sliderImages.length],
  ];

  return (
    <div className="slider-section">
      <button className="slider-btn" onClick={prevSlide}>&lt;</button>
      <div className="slider-cards">
        {visibleImages.map((img, idx) => (
          <div className="slider-card" key={current + '-' + idx}>
            <img src={img} alt={`slider-${current + idx + 1}`} className="slider-img" />
          </div>
        ))}
      </div>
      <button className="slider-btn" onClick={nextSlide}>&gt;</button>
    </div>
  )
}

export default Slider