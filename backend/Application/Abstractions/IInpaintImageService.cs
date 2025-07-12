using Application.DTOs;

namespace Application.Abstractions
{
    public interface IInpaintImageService
    {
        Task<InpaintImageResponseDto> InpaintAsync(InpaintImageRequestDto request, CancellationToken cancellationToken);
    }
}
