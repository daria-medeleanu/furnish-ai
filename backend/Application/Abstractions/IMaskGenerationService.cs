namespace Application.Abstractions
{
    public interface IMaskGenerationService
    {
        Task<(byte[] MaskBytes, string ContentType)> GenerateMaskAsync(byte[] originalImage, string category, CancellationToken cancellationToken);
    }
}
