using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class PasswordRepository : IPasswordResetTokenRepository
    {
        private readonly ApplicationDbContext context;
        public PasswordRepository(ApplicationDbContext context)
        {
            this.context = context;
        }
        public async Task AddAsync(PasswordResetToken token, CancellationToken cancellationToken = default)
        {
            await context.AddAsync(token, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }
        public async Task<ErrorOr<PasswordResetToken>> GetByTokenAsync(string token, CancellationToken cancellationToken = default)
        {
            var tokenEntry = await context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.Token == token, cancellationToken);

            if (tokenEntry is null)
            {
                return Error.NotFound(description: "Reset token not found.");
            }

            return tokenEntry;
        }
        public async Task MarkAsUsedAsync(PasswordResetToken token)
        {
            token.IsUsed = true;
            context.Update(token);
            await context.SaveChangesAsync();
        }

    }
}
