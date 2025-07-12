namespace Application.DTOs
{
    public class InpaintImageResponseDto
    {
        public byte[] ImageData { get; set; }
        public string ContentType { get; set; } = "image/png";
        public string? ErrorMessage { get; set; }
        public bool IsSuccess => string.IsNullOrEmpty(ErrorMessage);
    }
}