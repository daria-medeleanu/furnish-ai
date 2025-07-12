using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetFavoritesQuery : IRequest<ErrorOr<IEnumerable<FavoriteDto>>>
    {
        public Guid UserId { get; set; }
    }
}
