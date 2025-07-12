using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using Infrastructure.Errors;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class CategoryRepository(ApplicationDbContext context) : ICategoryRepository
    {
        private readonly ApplicationDbContext applicationDbContext = context;

        public async Task<ErrorOr<Guid>> AddAsync(Category category, CancellationToken cancellationToken)
        {
            try
            {
                await context.Categories.AddAsync(category);
                await context.SaveChangesAsync(cancellationToken);
                return category.Id;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<Deleted>> DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var category = await context.Categories.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
                if (category is not null)
                {
                    context.Categories.Remove(category);
                    await context.SaveChangesAsync(cancellationToken);
                }
                return Result.Deleted;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<IEnumerable<Category>>> GetAllAsync(CancellationToken cancellationToken)
        {
            try
            {
                return await context.Categories.ToListAsync(cancellationToken);
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<Category>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var category = await context.Categories
                    .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
                return category ?? RepositoryErrors.NotFound.ToErrorOr<Category>();
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<Updated>> UpdateAsync(Category category, CancellationToken cancellationToken)
        {
            try
            {
                context.Entry(category).State = EntityState.Modified;
                await context.SaveChangesAsync(cancellationToken);
                return Result.Updated;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        

        public async Task<ErrorOr<IEnumerable<Category>>> GetCategoriesByTitleAsync(string title, CancellationToken cancellationToken)
        {
            try
            {
                var categories = await context.Categories
                    .Where(e => e.Title == title)
                    .ToListAsync(cancellationToken);

                return categories.Any() ? categories : RepositoryErrors.NotFound.ToErrorOr<IEnumerable<Category>>();
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }
    }
}
