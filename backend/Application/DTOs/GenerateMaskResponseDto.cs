namespace Application.DTOs
{
    public class GenerateMaskResponseDto
    {
        public required byte[] MaskImage { get; set; }
        public required string ContentType { get; set; }

    }
}
