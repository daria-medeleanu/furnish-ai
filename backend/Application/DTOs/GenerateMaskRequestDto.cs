using Microsoft.AspNetCore.Http;

namespace Application.DTOs
{
    public class GenerateMaskRequestDto
    {
        public required IFormFile OriginalImage { get; set; }
        public required string Category { get; set; }
    }
}
