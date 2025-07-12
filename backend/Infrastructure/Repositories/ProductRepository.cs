using Application.Use_Cases.Queries;
using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using Infrastructure.Errors;
using Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ProductRepository(ApplicationDbContext context) : IProductRepository
    {
        private readonly ApplicationDbContext context = context;

        public async Task<ErrorOr<Guid>> AddAsync(Product product, CancellationToken cancellationToken)
        {
            try
            {
                await context.Products.AddAsync(product);
                await context.SaveChangesAsync(cancellationToken);
                return product.Id;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<Deleted>> DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var product = await context.Products.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
                if (product != null)
                {
                    context.Products.Remove(product);
                    await context.SaveChangesAsync(cancellationToken);
                }
                return Result.Deleted;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }

        }

        public async Task<ErrorOr<IEnumerable<Product>>> GetAllAsync(CancellationToken cancellationToken)
        {
            try
            {
                return await context.Products
                    .Include(p => p.Category)
                    .ToListAsync(cancellationToken);
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }

        }

        public async Task<ErrorOr<Product>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var product = await context.Products
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
                return product ?? RepositoryErrors.NotFound.ToErrorOr<Product>();
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<Updated>> UpdateAsync(Product product, CancellationToken cancellationToken)
        {
            try
            {
                context.Entry(product).State = EntityState.Modified;
                await context.SaveChangesAsync(cancellationToken);
                return Result.Updated;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }
        public async Task<ErrorOr<IEnumerable<Product>>> GetProductsByUserIdAsync(Guid UserId, CancellationToken cancellationToken)
        {
            try
            {
                return await context.Products
                    .Where(p => p.UserId == UserId)
                    .Include(p => p.Category)
                    .ToListAsync(cancellationToken);
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex)
            {
                return RepositoryErrors.Unknown(ex);
            }
        }

        public async Task<ErrorOr<IEnumerable<Product>>> GetActiveProductsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                return await context.Products
                    .Where(p => p.IsActive)
                    .Include(p => p.User)
                    .Include(p => p.Category)
                    .ToListAsync(cancellationToken);
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<PaginatedResult<Product>>> GetActiveProductsPaginatedAsync(int page, int pageSize, string? title, decimal? minPrice, decimal? maxPrice, string? city, Guid? categoryId,  CancellationToken cancellationToken)
        {
            try
            {
                var query = context.Products
                    .Where(p => p.IsActive)
                    .Include(p => p.User)
                    .Include(p => p.Category)
                    .AsQueryable();
                if (!string.IsNullOrEmpty(city))
                {
                    query = query.Where(p => p.User.City.ToLower() == city.ToLower());
                }
                if (!string.IsNullOrEmpty(title))
                {
                    query = query.Where(p => p.Title.Contains(title));
                }
                if(categoryId.HasValue)
                {
                    query = query.Where(p => p.CategoryId == categoryId.Value);
                }
                if (minPrice.HasValue)
                {
                    query = query.Where(p => p.Price >= minPrice.Value);
                }

                if (maxPrice.HasValue)
                {
                    query = query.Where(p => p.Price <= maxPrice.Value);
                }

                var totalCount = await query.CountAsync(cancellationToken);
                var products = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync(cancellationToken);

                return new PaginatedResult<Product>
                {
                    Items = products,
                    TotalCount = totalCount,
                    PageNumber = page,
                    PageSize = pageSize
                };

            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<IEnumerable<Product>>> SearchByTitleAsync(string title, CancellationToken cancellationToken)
        {
            try
            {
                var products = await context.Products
                    .Where(p => p.IsActive && p.Title.ToLower().Contains(title.ToLower()))
                    .ToListAsync(cancellationToken);

                return products;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }
    }
}