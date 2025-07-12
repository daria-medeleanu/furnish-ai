using Domain.Entities;
using ErrorOr;

namespace Domain.Repositories
{
    public interface IFavoriteRepository 
    {
        Task<ErrorOr<Guid>> AddAsync(Favorite favorite, CancellationToken cancellationToken);
        Task<ErrorOr<Deleted>> DeleteAsync(Guid userId, Guid productId, CancellationToken cancellationToken);
        Task<ErrorOr<IEnumerable<Favorite>>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
        Task<ErrorOr<Favorite?>> GetByUserAndProductAsync(Guid userId, Guid productId, CancellationToken cancellationToken);
        Task<ErrorOr<bool>> ToggleAsync(Guid userId, Guid productId, CancellationToken cancellationToken);
        Task<ErrorOr<bool>> IsFavoriteAsync(Guid userId, Guid productId, CancellationToken cancellationToken);
    }
}
