import React from "react";

const SmallProductCard = ({ product, onClick }) => {
  const image = (product.imageUrls && product.imageUrls[0]) || product.imageUrl || "/assets/canapea.jpg";
  return (
    <div
      className="small-product-card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        padding: 12,
        minWidth: 180,
        maxWidth: 220,
        margin: "0 auto",
        fontFamily:"'DM Sans:Medium', sans-serif",
      }}
      onClick={onClick}
    >
      <img
        src={image}
        alt={product.title}
        style={{
          width: 140,
          height: 140,
          objectFit: "cover",
          borderRadius: 8,
          marginBottom: 10,
          background: "#f7f7f7"
        }}
      />
      <div
        className="small-product-title"
        style={{
          textAlign: "center",
          fontWeight: 500,
          fontSize: 16,
          marginBottom: 6,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
          fontFamily:"'DM Sans:Medium', sans-serif",
        }}
        title={product.title}
      >
        {product.title}
      </div>
      <div
        className="small-product-price"
        style={{
          textAlign: "center",
          color: "#0B6BCB",
          fontWeight: "bold",
          fontSize: 15,
          fontFamily:"'DM Sans:Medium', sans-serif",
        }}
      >
        {product.price} {product.currency}
      </div>
    </div>
  );
};

export default SmallProductCard;