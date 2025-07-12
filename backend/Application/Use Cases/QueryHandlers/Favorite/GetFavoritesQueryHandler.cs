using Application.DTOs;
using Application.Use_Cases.Queries;
using Application.Utils;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetFavoritesQueryHandler : IRequestHandler<GetFavoritesQuery, ErrorOr<IEnumerable<FavoriteDto>>>
    {
        private readonly IFavoriteRepository favoriteRepository;
        private readonly IMapper mapper;

        public GetFavoritesQueryHandler(IFavoriteRepository favoriteRepository, IMapper mapper)
        {
            this.favoriteRepository = favoriteRepository;
            this.mapper = mapper;
        }

        public async Task<ErrorOr<IEnumerable<FavoriteDto>>> Handle(GetFavoritesQuery request, CancellationToken cancellationToken)
        {
            var favoritesResult = await favoriteRepository.GetByUserIdAsync(request.UserId, cancellationToken);
            return favoritesResult.MapList<Favorite, FavoriteDto>(mapper);
        }
    }
}
