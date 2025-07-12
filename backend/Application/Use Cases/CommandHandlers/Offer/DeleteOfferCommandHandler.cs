using Application.Use_Cases.Commands;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeleteOfferCommandHandler(IOfferRepository offerRepository) : IRequestHandler<DeleteOfferCommand, ErrorOr<Deleted>>
    {
        public async Task<ErrorOr<Deleted>> Handle(DeleteOfferCommand request, CancellationToken cancellationToken)
        {
            var offerResult = await offerRepository.DeleteOfferAsync(request.OfferId, cancellationToken);
            if (offerResult.IsError)
                return offerResult.Errors;
            return Result.Deleted;
        }
    }
}
