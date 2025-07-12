using Domain.Entities;
using ErrorOr;

namespace Domain.Repositories
{
    public interface IOrderRepository : IRepository<Order, Guid>
    {
        Task<ErrorOr<IEnumerable<Order>>> GetActiveOrdersByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<ErrorOr<IEnumerable<Order>>> GetHistoryOrdersByUserIdAsync(Guid sellerId, CancellationToken cancellationToken = default);
        Task<ErrorOr<IEnumerable<Order>>> GetActiveProductsBySellerIdAsync(Guid sellerId, CancellationToken cancellationToken = default);
        Task<ErrorOr<IEnumerable<Order>>> GetSoldProductsBySellerIdAsync(Guid sellerId, CancellationToken cancellationToken = default);
        Task<ErrorOr<Updated>> StartDeliveryAsync(Guid orderId, CancellationToken cancellationToken = default);
        Task<ErrorOr<Updated>> MarkAsDeliveredAsync(Guid orderId, CancellationToken cancellationToken = default);
    }
}
