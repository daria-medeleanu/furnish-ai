using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class InpaintImageCommand : IRequest<InpaintImageResponseDto>
    {
        public InpaintImageRequestDto Request { get; }
        public InpaintImageCommand(InpaintImageRequestDto request)
        {
            Request = request;
        }
    }
}
