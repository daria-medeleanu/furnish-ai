using Application.Abstractions;
using Application.DTOs;
using Application.Use_Cases.Commands;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class GenerateMaskCommandHandler : IRequestHandler<GenerateMaskCommand, GenerateMaskResponseDto>
    {
        private readonly IMaskGenerationService _maskGenerationService;

        public GenerateMaskCommandHandler(IMaskGenerationService maskGenerationService)
        {
            _maskGenerationService = maskGenerationService;
        }

        public async Task<GenerateMaskResponseDto> Handle(GenerateMaskCommand command, CancellationToken cancellationToken)
        {
            using var imageStream = new MemoryStream();
            await command.Request.OriginalImage.CopyToAsync(imageStream, cancellationToken);
            var originalImageBytes = imageStream.ToArray();

            var (maskBytes, contentType) = await _maskGenerationService.GenerateMaskAsync( 
                originalImageBytes,
                command.Request.Category,
                cancellationToken 
            );
            return new GenerateMaskResponseDto 
            { 
                MaskImage = maskBytes, 
                ContentType = contentType 
            };
        }
    }
}
