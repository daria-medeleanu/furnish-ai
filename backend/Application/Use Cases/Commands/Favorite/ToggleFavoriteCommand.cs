using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class ToggleFavoriteCommand() : IRequest<ErrorOr<bool>>
    {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
    }

}
