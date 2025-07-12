using Application.Use_Cases.Commands;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class RejectOfferCommandHandler(IOfferRepository offerRepository) : IRequestHandler<RejectOfferCommand, ErrorOr<Updated>>
    {
        public async Task<ErrorOr<Updated>> Handle(RejectOfferCommand request, CancellationToken cancellationToken)
        {
            var offerResult = await offerRepository.RejectOfferAsync(request.OfferId, cancellationToken);
            if (offerResult.IsError)
                return offerResult.Errors;
            return Result.Updated;
        }

    }
}
