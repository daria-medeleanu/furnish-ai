using Application.Use_Cases.Queries;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class IsFavoriteQueryHandler : IRequestHandler<IsFavoriteQuery, ErrorOr<bool>>
    {
        private readonly IFavoriteRepository favoriteRepository;

        public IsFavoriteQueryHandler(IFavoriteRepository favoriteRepository)
        {
            favoriteRepository = favoriteRepository;
        }

        public async Task<ErrorOr<bool>> Handle(IsFavoriteQuery request, CancellationToken cancellationToken)
        {
            return await favoriteRepository.IsFavoriteAsync(request.UserId, request.ProductId, cancellationToken);
        }
    }
}
