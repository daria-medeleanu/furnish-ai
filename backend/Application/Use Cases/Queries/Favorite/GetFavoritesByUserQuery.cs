using Domain.Entities;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetFavoritesByUserQuery : IRequest<ErrorOr<IEnumerable<Favorite>>>
    {
        public Guid UserId { get; set; }
    }
}
