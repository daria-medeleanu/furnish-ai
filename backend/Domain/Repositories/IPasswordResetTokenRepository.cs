using Domain.Entities;
using ErrorOr;

namespace Domain.Repositories
{
    public interface IPasswordResetTokenRepository
    {
        Task AddAsync(PasswordResetToken token, CancellationToken cancellationToken = default);
        Task<ErrorOr<PasswordResetToken>> GetByTokenAsync(string token, CancellationToken cancellationToken = default);
        Task MarkAsUsedAsync(PasswordResetToken token);

    }
}
