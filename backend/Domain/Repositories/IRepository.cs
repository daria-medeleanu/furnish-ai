
using ErrorOr;

namespace Domain.Repositories
{
    public interface IRepository<TEntity, Tid>
    {
        Task<ErrorOr<IEnumerable<TEntity>>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<ErrorOr<TEntity>> GetByIdAsync(Tid id, CancellationToken cancellationToken = default);
        Task<ErrorOr<Tid>> AddAsync(TEntity entity, CancellationToken cancellationToken = default);
        Task<ErrorOr<Updated>> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);
        Task<ErrorOr<Deleted>> DeleteAsync(Tid id, CancellationToken cancellationToken = default);
    }
}
