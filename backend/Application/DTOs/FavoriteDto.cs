using System.Data.SqlTypes;

namespace Application.DTOs
{
    public class FavoriteDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductTitle { get; set; }
        public string ProductImageUrl { get; set; }
        public decimal ProductPrice { get; set; }
        public ProductDto? Product { get; set; }
    }
}
