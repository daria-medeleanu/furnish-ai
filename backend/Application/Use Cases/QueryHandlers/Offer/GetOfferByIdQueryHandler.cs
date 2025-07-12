using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetOfferByIdQueryHandler : IRequestHandler<GetOfferByIdQuery, ErrorOr<OfferDto>>
    {
        private readonly IOfferRepository offerRepository;
        private readonly IProductRepository productRepository;
        private readonly IMapper mapper;

        public GetOfferByIdQueryHandler(
            IOfferRepository offerRepository,
            IProductRepository productRepository,
            IMapper mapper)
        {
            this.offerRepository = offerRepository;
            this.productRepository = productRepository;
            this.mapper = mapper;
        }

        public async Task<ErrorOr<OfferDto>> Handle(GetOfferByIdQuery request, CancellationToken cancellationToken)
        {
            var offerResult = await offerRepository.GetByIdAsync(request.Id, cancellationToken);
            if (offerResult.IsError)
                return offerResult.Errors;

            var offer = offerResult.Value;

            var productResult = await productRepository.GetByIdAsync(offer.ProductId, cancellationToken);
            if (productResult.IsError)
                return productResult.Errors;

            var offerDto = mapper.Map<OfferDto>(offer);
            offerDto.ProductTitle = productResult.Value.Title;
            offerDto.ProductOriginalPrice = productResult.Value.Price;

            return offerDto;
        }
    }
}
