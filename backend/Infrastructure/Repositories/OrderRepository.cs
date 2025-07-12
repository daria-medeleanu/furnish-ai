using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using Infrastructure.Errors;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class OrderRepository(ApplicationDbContext context) : IOrderRepository
    {
        private readonly ApplicationDbContext context = context;
        public async Task<ErrorOr<Guid>> AddAsync(Order order, CancellationToken cancellationToken = default)
        {
            try
            {
                await context.Orders.AddAsync(order);
                await context.SaveChangesAsync(cancellationToken);
                return order.Id;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled;}
            catch (Exception ex) { return RepositoryErrors.Unknown(ex);}
        }

        public async Task<ErrorOr<Deleted>> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var order = await context.Orders.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
                if (order != null)
                {
                    context.Orders.Remove(order);
                    await context.SaveChangesAsync(cancellationToken);
                }
                return Result.Deleted;
            }
            catch(OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<IEnumerable<Order>>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                return await context.Orders
                    .ToListAsync(cancellationToken);
            }
            catch(OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<Order>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var order = await context.Orders
                    .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
                return order ?? RepositoryErrors.NotFound.ToErrorOr<Order>();
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }
        public async Task<ErrorOr<Updated>> UpdateAsync(Order order, CancellationToken cancellationToken = default)
        {
            try
            {
                context.Entry(order).State = EntityState.Modified;
                await context.SaveChangesAsync(cancellationToken);
                return Result.Updated;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<Updated>> StartDeliveryAsync(Guid orderId, CancellationToken cancellationToken = default)
        {
            try
            {
                var order = await context.Orders.FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);
                if (order == null) return RepositoryErrors.NotFound.ToErrorOr<Updated>();

                order.OrderStatus = "InTransit";
                context.Entry(order).State = EntityState.Modified;
                await context.SaveChangesAsync(cancellationToken);
                return Result.Updated;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<Updated>> MarkAsDeliveredAsync(Guid orderId, CancellationToken cancellationToken = default)
        {
            try
            {
                var order = await context.Orders.FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);
                if (order == null) return RepositoryErrors.NotFound.ToErrorOr<Updated>();

                order.OrderStatus = "Delivered";
                context.Entry(order).State = EntityState.Modified;
                await context.SaveChangesAsync(cancellationToken);
                return Result.Updated;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }
        public async Task<ErrorOr<IEnumerable<Order>>> GetActiveOrdersByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            try
            {
                return await context.Orders
                    .Include(o => o.Seller)
                    .Include(o => o.Product)
                    .Where(o => o.ClientId == userId)
                    .Where(o => o.OrderStatus == "Pending" || o.OrderStatus == "InTransit")
                    .ToListAsync(cancellationToken);
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }
        public async Task<ErrorOr<IEnumerable<Order>>> GetHistoryOrdersByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            try
            {
                return await context.Orders
                    .Include(o => o.Seller)
                    .Include(o=> o.Product)
                    .Where(o => o.ClientId == userId)
                    .Where(o => o.OrderStatus == "Delivered")
                    .ToListAsync(cancellationToken);
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch(Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

        public async Task<ErrorOr<IEnumerable<Order>>> GetActiveProductsBySellerIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            try
            {
                var orders = await context.Orders
                    .Include(o=> o.Client)
                    .Include(o => o.Product)
                    .Where(o => o.SellerId == userId)
                    .Where(o => o.OrderStatus == "Pending" || o.OrderStatus == "InTransit")
                    .ToListAsync(cancellationToken);
                return orders;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch (Exception ex) { return RepositoryErrors.Unknown(ex); }
        }
        public async Task<ErrorOr<IEnumerable<Order>>> GetSoldProductsBySellerIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            try
            {
                var orders = await context.Orders
                    .Include(o => o.Client)
                    .Include(o => o.Product)
                    .Where(o => o.SellerId == userId)
                    .Where(o => o.OrderStatus == "Delivered")
                    .ToListAsync(cancellationToken);
                return orders;
            }
            catch (OperationCanceledException) { return RepositoryErrors.Cancelled; }
            catch(Exception ex) { return RepositoryErrors.Unknown(ex); }
        }

    }
}
