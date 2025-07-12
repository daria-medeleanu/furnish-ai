namespace Application.DTOs
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public SellerDto Seller { get; set; }
        public ClientDto Client { get; set; }
        public Guid ClientId { get; set; }
        public Guid SellerId { get; set; }
        public Guid ProductId { get; set; }
        public string ProductTitle { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public string Address { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }

    }
}
