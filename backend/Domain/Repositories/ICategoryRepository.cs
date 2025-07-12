using Domain.Entities;
using ErrorOr;

namespace Domain.Repositories
{
    public interface ICategoryRepository : IRepository<Category, Guid>
    {
        Task<ErrorOr<IEnumerable<Category>>> GetCategoriesByTitleAsync(string title, CancellationToken cancellationToken);
    }
}
