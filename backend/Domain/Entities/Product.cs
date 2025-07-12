namespace Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string Condition { get; set; }
        public string Currency { get; set; }
        public decimal Views { get; set; } = 0;
        public Guid? CategoryId { get; set; }
        public Category? Category { get; set; }
        public required Guid UserId { get; set; }
        public User User { get; set; }
        public List<string> ImageUrls { get; set; } = new();
        public bool IsActive { get; set; } = true;
    }
}
