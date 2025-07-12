using Domain.Enums;

namespace Domain.Entities
{
    public class Order
    {
        public Guid Id { get; set; }

        public Guid ClientId { get; set; }
        public User Client { get; set; } 

        public Guid SellerId { get; set; }
        public User Seller { get; set; } 

        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        public DateTime OrderDate { get; set; }

        public string OrderStatus { get; set; }
        public string Address { get; set; }

        public decimal Price { get; set; }
        public string Currency { get; set; }
    }
}