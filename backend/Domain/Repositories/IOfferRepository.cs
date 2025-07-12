using Domain.Entities;
using ErrorOr;

namespace Domain.Repositories
{
    public interface IOfferRepository : IRepository<Offer, Guid>
    {
        Task<ErrorOr<IEnumerable<Offer>>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
        Task<ErrorOr<IEnumerable<Offer>>> GetAllOffersByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<ErrorOr<IEnumerable<Offer>>> GetBySellerIdAsync(Guid sellerId, CancellationToken cancellationToken = default);
        Task<ErrorOr<bool>> HasPendingOfferAsync(Guid buyerId, Guid productId, CancellationToken cancellationToken = default);
        Task<ErrorOr<Updated>> AcceptOfferAsync (Guid offerId, CancellationToken cancellationToken = default);
        Task<ErrorOr<Updated>> RejectOfferAsync(Guid offerId, CancellationToken cancellationToken = default);
        Task<ErrorOr<Deleted>> DeleteOfferAsync(Guid offerId, CancellationToken cancellationToken = default);
    }
}
