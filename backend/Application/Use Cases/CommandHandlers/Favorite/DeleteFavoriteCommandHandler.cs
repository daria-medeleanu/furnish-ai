using Application.Use_Cases.Commands;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeleteFavoriteCommandHandler : IRequestHandler<DeleteFavoriteCommand, ErrorOr<Deleted>>
    {
        private readonly IFavoriteRepository favoriteRepository;

        public DeleteFavoriteCommandHandler(IFavoriteRepository favoriteRepository)
        {
            this.favoriteRepository = favoriteRepository;
        }
        public async Task<ErrorOr<Deleted>> Handle(DeleteFavoriteCommand request, CancellationToken cancellationToken)
        {
            return await favoriteRepository.DeleteAsync(request.UserId, request.ProductId, cancellationToken);
        }
    }
}
