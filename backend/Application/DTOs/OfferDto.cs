namespace Application.DTOs
{
    public class OfferDto
    {
        public Guid Id { get; set; }
        public UserDto? Buyer { get; set; }
        public Guid ProductId { get; set; }
        public string? ProductTitle { get; set; }
        public decimal ProductOriginalPrice { get; set; }
        public ProductDto? Product { get; set; }
        public decimal OfferedPrice { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
        public string? SellerResponse { get; set; }
        public string? Message { get; set; }
    }
}
