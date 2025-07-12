using Application.Abstractions;
using Application.DTOs;
using Application.Use_Cases.Commands;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class InpaintImageCommandHandler : IRequestHandler<InpaintImageCommand, InpaintImageResponseDto>
    {
        private readonly IInpaintImageService _inpaintImageService;

        public InpaintImageCommandHandler(IInpaintImageService inpaintImageService)
        {
            _inpaintImageService = inpaintImageService;
        }

        public async Task<InpaintImageResponseDto> Handle(InpaintImageCommand command, CancellationToken cancellationToken)
        {
            return await _inpaintImageService.InpaintAsync(command.Request, cancellationToken);
        }
    }
}
