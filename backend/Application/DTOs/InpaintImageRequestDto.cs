using Microsoft.AspNetCore.Http;

namespace Application.DTOs
{
    public class InpaintImageRequestDto
    {
        public required IFormFile OriginalImage { get; set; }
        public required IFormFile MaskImage { get; set; }
        public required string Prompt { get; set; }
        public string? NegativePrompt { get; set; }
        public int NumInferenceSteps { get; set; } = 25;
        public double GuidanceScale { get; set; } = 7.5;
        public int Seed { get; set; } = -1;
    }
}
