using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class AddFavoriteCommand : IRequest<ErrorOr<Guid>>
    {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
    }
}
