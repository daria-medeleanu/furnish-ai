using Application.Abstractions;
using Application.DTOs;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace Infrastructure.Services
{
    public class InpaintImageService : IInpaintImageService
    {
        private readonly HttpClient _httpClient;
        private readonly string _gradioApiUrl;

        public InpaintImageService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _httpClient.Timeout = TimeSpan.FromMinutes(10);
            _gradioApiUrl = "https://dariamed-inpaint-test.hf.space/gradio_api/call/inpaint_image";
        }

        public async Task<InpaintImageResponseDto> InpaintAsync(InpaintImageRequestDto request, CancellationToken cancellationToken)
        {
            try
            {
                string ToBase64String(Microsoft.AspNetCore.Http.IFormFile file)
                {
                    using var ms = new MemoryStream();
                    file.CopyTo(ms);
                    var base64 = Convert.ToBase64String(ms.ToArray());
                    return $"data:{file.ContentType};base64,{base64}";
                }

                var originalImageBase64 = ToBase64String(request.OriginalImage);
                var maskImageBase64 = ToBase64String(request.MaskImage);

                var originalImageDict = new
                {
                    url = originalImageBase64,
                    mime_type = request.OriginalImage.ContentType,
                    is_stream = false,
                    meta = new { }
                };

                var maskImageDict = new
                {
                    url = maskImageBase64,
                    mime_type = request.MaskImage.ContentType,
                    is_stream = false,
                    meta = new { }
                };

                var payload = new
                {
                    data = new object[]
                    {
                        originalImageDict,
                        maskImageDict,
                        request.Prompt,
                        request.NegativePrompt ?? "",
                        request.NumInferenceSteps,
                        request.GuidanceScale,
                        request.Seed
                    }
                };

                var jsonPayload = JsonSerializer.Serialize(payload);
                using var content = new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(_gradioApiUrl, content, cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                    return new InpaintImageResponseDto
                    {
                        ErrorMessage = $"Gradio API Error: {response.StatusCode} - {errorContent}"
                    };
                }

                var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);
                Console.WriteLine(responseJson);
                using var doc = JsonDocument.Parse(responseJson);

                if (!doc.RootElement.TryGetProperty("event_id", out var eventIdElement))
                {
                    return new InpaintImageResponseDto
                    {
                        ErrorMessage = $"No event_id in Gradio response: {responseJson}"
                    };
                }
                var eventId = eventIdElement.GetString();

                string resultUrl = $"https://dariamed-inpaint-test.hf.space/gradio_api/call/inpaint_image/{eventId}";
                string? outputUrl = null;
                int maxTries = 3;

                await Task.Delay(20000, cancellationToken);

                for (int i = 0; i < maxTries; i++)
                {
                    await Task.Delay(3000, cancellationToken); 

                    var resultResponse = await _httpClient.GetAsync(resultUrl, cancellationToken);
                    var resultJson = await resultResponse.Content.ReadAsStringAsync(cancellationToken);

                    var dataPrefix = "data: ";
                    var dataStart = resultJson.IndexOf(dataPrefix, StringComparison.Ordinal);
                    if (dataStart >= 0)
                    {
                        dataStart += dataPrefix.Length;
                        var dataEnd = resultJson.IndexOf('\n', dataStart);
                        if (dataEnd > dataStart)
                        {
                            var jsonData = resultJson.Substring(dataStart, dataEnd - dataStart);

                            
                            using var jsonDoc = JsonDocument.Parse(jsonData);
                            var root = jsonDoc.RootElement;

                            if (root.ValueKind == JsonValueKind.Array && root.GetArrayLength() > 0)
                            {
                                var fileObj = root[0];
                                if (fileObj.TryGetProperty("url", out var urlProp))
                                {
                                    outputUrl = urlProp.GetString();
                                    break;
                                }
                            }
                        }
                    }
                }

                if (string.IsNullOrEmpty(outputUrl))
                {
                    return new InpaintImageResponseDto
                    {
                        ErrorMessage = "Timed out waiting for Gradio job to complete."
                    };
                }

                var imageResponse = await _httpClient.GetAsync(outputUrl, cancellationToken);
                if (!imageResponse.IsSuccessStatusCode)
                {
                    return new InpaintImageResponseDto
                    {
                        ErrorMessage = $"Failed to download result image: {imageResponse.StatusCode}"
                    };
                }

                var imageBytes = await imageResponse.Content.ReadAsByteArrayAsync(cancellationToken);
                var contentType = imageResponse.Content.Headers.ContentType?.ToString() ?? "image/png";

                return new InpaintImageResponseDto
                {
                    ImageData = imageBytes,
                    ContentType = contentType
                };
            }
            catch (Exception ex)
            {
                return new InpaintImageResponseDto
                {
                    ErrorMessage = $"Error calling Gradio API: {ex.Message}"
                };
            }
        }
    }
}