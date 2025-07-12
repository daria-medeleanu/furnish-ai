using Application.Use_Cases.Queries;
using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetFavoritesByUserQueryHandler : IRequestHandler<GetFavoritesByUserQuery, ErrorOr<IEnumerable<Favorite>>>
    {
        private readonly IFavoriteRepository favoriteRepository;

        public GetFavoritesByUserQueryHandler(IFavoriteRepository favoriteRepository)
        {
            favoriteRepository = favoriteRepository;
        }

        public async Task<ErrorOr<IEnumerable<Favorite>>> Handle(GetFavoritesByUserQuery request, CancellationToken cancellationToken)
        {
            return await favoriteRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        }
    }
}
