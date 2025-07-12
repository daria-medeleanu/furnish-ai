using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class GenerateMaskCommand : IRequest<GenerateMaskResponseDto>
    {
        public GenerateMaskRequestDto Request { get; }
        public GenerateMaskCommand(GenerateMaskRequestDto request)
        {
            Request = request;
        }
    }
}
