using Domain.Entities;
using ErrorOr;

namespace Domain.Repositories
{
    public interface IProductRepository : IRepository<Product, Guid>
    {
        Task<ErrorOr<IEnumerable<Product>>> GetProductsByUserIdAsync(Guid UserId, CancellationToken cancellationToken);
        Task<ErrorOr<IEnumerable<Product>>> GetActiveProductsAsync(CancellationToken cancellationToken = default);
        Task<ErrorOr<PaginatedResult<Product>>> GetActiveProductsPaginatedAsync(int pageNumber, int pageSize, string? title, decimal? minPrice, decimal? maxPrice, string? city, Guid? categoryId, CancellationToken cancellationToken = default);
        Task<ErrorOr<IEnumerable<Product>>> SearchByTitleAsync(string title, CancellationToken cancellationToken);
    }
}
