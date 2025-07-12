namespace Application.DTOs
{
    public class CreateOfferDto
    {
        public Guid ProductId { get; set; }
        public decimal OfferedPrice { get; set; }
        public string? Message { get; set; }
    }
}
