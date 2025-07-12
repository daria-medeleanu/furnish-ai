using Domain.Enums;

namespace Domain.Entities
{
    public class Offer
    {
        public Guid Id { get; set; }
        public Guid BuyerId { get; set; }
        public User? Buyer { get; set; }
        public string BuyerName { get; set; }
        public Guid ProductId { get; set; }
        public Product? Product { get; set; }
        public decimal OfferedPrice { get; set; }
        public string Currency { get; set; }
        public OfferStatus Status { get; set; } = OfferStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RespondedAt { get; set; }
        public string? SellerResponse { get; set; }
        public string? Message { get; set; }
    }
}
