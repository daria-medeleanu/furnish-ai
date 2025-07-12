using Application.Use_Cases.Commands;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class ToggleFavoriteCommandHandler : IRequestHandler<ToggleFavoriteCommand, ErrorOr<bool>>
    {
        private readonly IFavoriteRepository _favoriteRepository;

        public ToggleFavoriteCommandHandler(IFavoriteRepository favoriteRepository)
        {
            _favoriteRepository = favoriteRepository;
        }

        public async Task<ErrorOr<bool>> Handle(ToggleFavoriteCommand request, CancellationToken cancellationToken)
        {
            return await _favoriteRepository.ToggleAsync(request.UserId, request.ProductId, cancellationToken);
        }
        
    }
}
