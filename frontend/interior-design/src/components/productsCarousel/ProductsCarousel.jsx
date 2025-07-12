import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SmallProductCard from "../smallProductCard/SmallProductCard";
import "./productsCarousel.css";

const ProductCarousel = ({ products, onCardClick }) => {
  const [startIdx, setStartIdx] = useState(0);

  const maxVisible = 3;
  const canScrollLeft = startIdx > 0;
  const canScrollRight = startIdx + maxVisible < products.length;

  const handlePrev = (e) => {
    e.stopPropagation();
    if (canScrollLeft) setStartIdx(startIdx - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (canScrollRight) setStartIdx(startIdx + 1);
  };

  return (
    <div className="product-carousel-wrapper">
      <button
        className="carousel-arrow left"
        onClick={handlePrev}
        disabled={!canScrollLeft}
        aria-label="Previous"
      >
        <ArrowBackIosIcon />
      </button>
      <div className="carousel-cards">
        {products.slice(startIdx, startIdx + maxVisible).map((product, idx) => (
          <div className="carousel-card-item" key={product.id || idx}>
            <SmallProductCard
              product={product}
              onClick={() => onCardClick(product)}
            />
          </div>
        ))}
      </div>
      <button
        className="carousel-arrow right"
        onClick={handleNext}
        disabled={!canScrollRight}
        aria-label="Next"
      >
        <ArrowForwardIosIcon />
      </button>
    </div>
  );
};

export default ProductCarousel;