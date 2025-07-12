using Domain.Entities;
using ErrorOr;

namespace Domain.Repositories
{
    public interface IUserRepository
    {
        Task<ErrorOr<string>> Login(User user, CancellationToken cancellationToken);
        Task<ErrorOr<Guid>> Register(User user, CancellationToken cancellationToken);
        Task<ErrorOr<User>> GetByIdAsync(Guid id,  CancellationToken cancellationToken);
        Task<ErrorOr<Updated>> UpdateAsync(User user, CancellationToken cancellationToken);
        Task<ErrorOr<User>> GetByEmailAsync(string email, CancellationToken cancellationToken);

    }
}
