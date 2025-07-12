using Application.Abstractions;

namespace Infrastructure.Services
{
    public class MaskGenerationService : IMaskGenerationService
    {
        private readonly HttpClient _httpClient;
        public MaskGenerationService(HttpClient httpClient)
        {
            _httpClient = httpClient; 
        }
        public async Task<(byte[] MaskBytes, string ContentType)> GenerateMaskAsync(byte[] originalImage, string category, CancellationToken cancellationToken)
        {
            using var content = new MultipartFormDataContent();
            content.Add(new ByteArrayContent(originalImage), "image", "image.png");
            content.Add(new StringContent(category), "categories");
            
            var response = await _httpClient.PostAsync("http://localhost:5000/segment", content, cancellationToken);
            response.EnsureSuccessStatusCode();

            var maskBytes = await response.Content.ReadAsByteArrayAsync(cancellationToken);
            var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/octet-stream";
            return (maskBytes, contentType);
        }
    }
}
