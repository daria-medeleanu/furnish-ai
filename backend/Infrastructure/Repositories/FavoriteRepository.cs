using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using Infrastructure.Errors;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly ApplicationDbContext context;
        public FavoriteRepository(ApplicationDbContext context) => this.context = context;

        public async Task<ErrorOr<Guid>> AddAsync(Favorite favorite, CancellationToken cancellationToken)
        {
            try
            {
                await context.Favorites.AddAsync(favorite);
                await context.SaveChangesAsync(cancellationToken);
                return favorite.Id;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }
        public async Task<ErrorOr<IEnumerable<Favorite>>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            try
            {
                return await context.Favorites
                                    .Where(f => f.UserId == userId)
                                    .Include(f => f.Product)
                                    .ToListAsync(cancellationToken);
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex)
            {
                return RepositoryErrors.Unknown(ex);
            }
        }
        public async Task<ErrorOr<Deleted>> DeleteAsync(Guid userId, Guid productId, CancellationToken cancellationToken)
        {
            try
            {
                var favorite = await context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId, cancellationToken);
                if (favorite != null)
                {
                    context.Favorites.Remove(favorite);
                    await context.SaveChangesAsync(cancellationToken);
                }
                return Result.Deleted;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }

        }

        public async Task<ErrorOr<Favorite?>> GetByUserAndProductAsync(Guid userId, Guid productId, CancellationToken cancellationToken)
        {
            try
            {
                return await context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId, cancellationToken);
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex)
            {
                return RepositoryErrors.Unknown(ex);
            }
        }
        public async Task<ErrorOr<bool>> ToggleAsync(Guid userId, Guid productId, CancellationToken cancellationToken)
        {
            try
            {
                var favorite = await context.Favorites.FirstOrDefaultAsync(
                    f => f.UserId == userId && f.ProductId == productId, cancellationToken);

                if (favorite != null)
                {
                    
                    context.Favorites.Remove(favorite);
                    await context.SaveChangesAsync(cancellationToken);
                    return false; 
                }
                else
                {
                    var newFavorite = new Favorite
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        ProductId = productId
                    };

                    await context.Favorites.AddAsync(newFavorite, cancellationToken);
                    await context.SaveChangesAsync(cancellationToken);
                    return true; 
                }
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<bool>> IsFavoriteAsync(Guid userId, Guid productId, CancellationToken cancellationToken)
        {
            try
            {
                var exists = await context.Favorites.AnyAsync(
                    f => f.UserId == userId && f.ProductId == productId, cancellationToken);

                return exists;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }
    }
}
