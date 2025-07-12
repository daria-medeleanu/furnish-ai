using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using ErrorOr;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class OfferRepository : IOfferRepository
    {
        private readonly ApplicationDbContext context;

        public OfferRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<ErrorOr<Guid>> AddAsync(Offer entity, CancellationToken cancellationToken = default)
        {
            context.Offers.Add(entity);
            await context.SaveChangesAsync(cancellationToken);
            return entity.Id;
        }

        public async Task<ErrorOr<Deleted>> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var offer = await context.Offers.FindAsync(new object[] { id }, cancellationToken);
            if (offer == null)
                return Error.NotFound("Offer.NotFound", "Offer not found.");

            context.Offers.Remove(offer);
            await context.SaveChangesAsync(cancellationToken);
            return Result.Deleted;
        }

        public async Task<ErrorOr<IEnumerable<Offer>>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await context.Offers.ToListAsync(cancellationToken);
        }

        public async Task<ErrorOr<Offer>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var offer = await context.Offers.FindAsync(new object[] { id }, cancellationToken);
            if (offer == null)
                return Error.NotFound("Offer.NotFound", "Offer not found.");
            return offer;
        }

        public async Task<ErrorOr<Updated>> UpdateAsync(Offer entity, CancellationToken cancellationToken = default)
        {
            context.Offers.Update(entity);
            await context.SaveChangesAsync(cancellationToken);
            return Result.Updated;
        }

        public async Task<ErrorOr<IEnumerable<Offer>>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
        {
            var offers = await context.Offers
                .Where(o => o.ProductId == productId)
                .ToListAsync(cancellationToken);
            return offers;
        }

        public async Task<ErrorOr<IEnumerable<Offer>>> GetAllOffersByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var offers = await context.Offers
                .Where(o => o.BuyerId == userId)
                .ToListAsync(cancellationToken);
            return offers;
        }

        public async Task<ErrorOr<IEnumerable<Offer>>> GetBySellerIdAsync(Guid sellerId, CancellationToken cancellationToken = default)
        {
            var offers = await context.Offers
                .Include(o => o.Product)
                .Where(o => o.Product != null && o.Product.UserId == sellerId)
                .ToListAsync(cancellationToken);
            return offers;
        }

        public async Task<ErrorOr<bool>> HasPendingOfferAsync(Guid buyerId, Guid productId, CancellationToken cancellationToken = default)
        {
            var exists = await context.Offers
                .AnyAsync(o => o.BuyerId == buyerId && o.ProductId == productId && o.Status == OfferStatus.Pending, cancellationToken);
            return exists;
        }
        public async Task<ErrorOr<Updated>> AcceptOfferAsync(Guid offerId, CancellationToken cancellationToken = default)
        {
            var offer = await context.Offers.FindAsync(new object[] { offerId }, cancellationToken);

            if (offer == null)
                return Error.NotFound("Offer.NotFound", "Offer not found.");

            if (offer.Status != Domain.Enums.OfferStatus.Pending)
                return Error.Validation("Offer.InvalidState", "Only pending offers can be accepted.");

            offer.Status = Domain.Enums.OfferStatus.Accepted;

            var otherOffers = await context.Offers
                .Where(o => o.ProductId == offer.ProductId && o.Id != offerId && o.Status == Domain.Enums.OfferStatus.Pending)
                .ToListAsync(cancellationToken);

            foreach (var otherOffer in otherOffers)
            {
                otherOffer.Status = Domain.Enums.OfferStatus.Rejected;
            }

            await context.SaveChangesAsync(cancellationToken);
            return Result.Updated;
        }
        public async Task<ErrorOr<Updated>> RejectOfferAsync(Guid offerId, CancellationToken cancellationToken = default)
        {
            var offer = await context.Offers.FindAsync(new object[] { offerId }, cancellationToken);

            if (offer == null)
                return Error.NotFound("Offer.NotFound", "Offer not found.");

            if (offer.Status != Domain.Enums.OfferStatus.Pending)
                return Error.Validation("Offer.InvalidState", "Only pending offers can be rejected.");

            offer.Status = Domain.Enums.OfferStatus.Rejected;

            await context.SaveChangesAsync(cancellationToken);
            return Result.Updated;
        }
        public async Task<ErrorOr<Deleted>> DeleteOfferAsync(Guid offerId, CancellationToken cancellationToken = default)
        {
            var offer = await context.Offers.FindAsync(new object[] { offerId }, cancellationToken);
            if (offer == null)
                return Error.NotFound("Offer.NotFound", "Offer not found.");
            context.Offers.Remove(offer);
            await context.SaveChangesAsync(cancellationToken);
            return Result.Deleted;
        }
    }
}
