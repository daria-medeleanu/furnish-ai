using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class DeleteFavoriteCommand : IRequest<ErrorOr<Deleted>>
    {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }

    }
}
