using Application.Use_Cases.Commands;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class AcceptOfferCommandHandler(IOfferRepository offerRepository) : IRequestHandler<AcceptOfferCommand, ErrorOr<Updated>>
    {
        public async Task<ErrorOr<Updated>> Handle(AcceptOfferCommand request, CancellationToken cancellationToken)
        {
            var offerResult = await offerRepository.AcceptOfferAsync(request.OfferId, cancellationToken);
            if (offerResult.IsError)
                return offerResult.Errors;
            return Result.Updated;
        }
    }
}
