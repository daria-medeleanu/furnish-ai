using Application.Use_Cases.Commands;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class AddFavoriteCommandHandler : IRequestHandler<AddFavoriteCommand, ErrorOr<Guid>>
    {
        private readonly IFavoriteRepository favoriteRepository;

        public AddFavoriteCommandHandler(IFavoriteRepository favoriteRepository)
        {
            this.favoriteRepository = favoriteRepository;
        }

        public async Task<ErrorOr<Guid>> Handle(AddFavoriteCommand request, CancellationToken cancellationToken)
        {
            var favorite = new Domain.Entities.Favorite
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                ProductId = request.ProductId,
            };

            return await favoriteRepository.AddAsync(favorite, cancellationToken); 
        }

    }
}
