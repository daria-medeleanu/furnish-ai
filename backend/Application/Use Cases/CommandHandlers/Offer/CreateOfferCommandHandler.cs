using Application.Use_Cases.Commands;
using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreateOfferCommandHandler(IOfferRepository offerRepository) : IRequestHandler<CreateOfferCommand, ErrorOr<Guid>>
    {   
        public async Task<ErrorOr<Guid>> Handle(CreateOfferCommand request, CancellationToken cancellationToken)
        {
            var hasPending = await offerRepository.HasPendingOfferAsync(request.BuyerId, request.ProductId, cancellationToken);
            if (hasPending.Value)
            {
                return Error.Conflict("Offer.Conflict", "You already have a pending offer for this product.");
            }

            var offer = new Offer
            {
                Id = Guid.NewGuid(),
                BuyerId = request.BuyerId,
                BuyerName = request.BuyerName,
                ProductId = request.ProductId,
                OfferedPrice = request.OfferedPrice,
                Currency = request.Currency,
                Status = OfferStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            return await offerRepository.AddAsync(offer, cancellationToken);
        }
    }
}
