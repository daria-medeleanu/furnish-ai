using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetAllOffersByUserIdQueryHandler(IOfferRepository offerRepository, IMapper mapper) : IRequestHandler<GetAllOffersByUserIdQuery, ErrorOr<IEnumerable<OfferDto>>>
    {
        public async Task<ErrorOr<IEnumerable<OfferDto>>> Handle(GetAllOffersByUserIdQuery request, CancellationToken cancellationToken)
        {
            var offerResult = await offerRepository.GetAllOffersByUserIdAsync(request.UserId, cancellationToken);
            if (offerResult.IsError)
                return offerResult.Errors;

            var offers = offerResult.Value;
            var offerDtos = new List<OfferDto>();

            foreach (var offer in offers)
            {
                var offerDto = mapper.Map<OfferDto>(offer);
                offerDtos.Add(offerDto);
            }

            return offerDtos;
        }

    }
}
