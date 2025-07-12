namespace Application.DTOs
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal Views { get; set; } = 0;
        public string Condition { get; set; }
        public string Currency { get; set; }
        public bool IsFavorite { get; set; }
        public CategoryDto? Category { get; set; }
        public required UserDto User { get; set; }
        public required List<string> ImageUrls { get; set; }
        public bool IsActive { get; set; }
    }
}
