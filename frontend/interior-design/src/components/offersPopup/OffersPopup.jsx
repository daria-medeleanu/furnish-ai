import React from "react";

const OffersPopup = ({ open, offers, onClose }) => {
  if (!open) return null;

  return (
    <div className="offer-modal">
      <div className="offer-modal-content">
        <h3>All Offers Made By You</h3>
        {(!offers || offers.length === 0) ? (
          <div>No offers found.</div>
        ) : (
          <div className="all-offers-wrapper">
            {offers.map((offer, idx) => (
              <div
                key={offer.id || idx}
                className={`offer-item-wrapper ${offer.status === "Pending" ? "pending" : offer.status === "Accepted" ? "accepted" : "rejected"}`}
              >
                <div className="offer-item">
                  <div><strong>Product:</strong> {offer.productTitle || offer.product?.title || offer.productId}</div>
                  <div><strong>Offered Price:</strong> {offer.offeredPrice}{offer.currency}</div>
                  <div><strong>Status:</strong> {offer.status}</div>
                  {offer.message && (
                    <div><strong>Message:</strong> {offer.message}</div>
                  )}
                  <div><strong>Date:</strong> {offer.createdAt ? new Date(offer.createdAt).toLocaleString() : ''}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="offer-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default OffersPopup;