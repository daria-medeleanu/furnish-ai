using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetOffersByProductQueryHandler : IRequestHandler<GetOffersByProductQuery, ErrorOr<IEnumerable<OfferDto>>>
    {
        private readonly IOfferRepository offerRepository;
        private readonly IProductRepository productRepository;
        private readonly IMapper mapper;

        public GetOffersByProductQueryHandler(IOfferRepository offerRepository, IProductRepository productRepository, IMapper mapper)
        {
            this.offerRepository = offerRepository;
            this.productRepository = productRepository;
            this.mapper = mapper;
        }

        public async Task<ErrorOr<IEnumerable<OfferDto>>> Handle(GetOffersByProductQuery request, CancellationToken cancellationToken)
        {
            var productResult = await productRepository.GetByIdAsync(request.ProductId, cancellationToken);
            if (productResult.IsError) return productResult.Errors;

            var product = productResult.Value;
            if (product.UserId != request.SellerId)
                return Error.Validation("NotAuthorized", "You can only view offers on your products.");

            var offersResult = await offerRepository.GetByProductIdAsync(request.ProductId, cancellationToken);
            if (offersResult.IsError) return offersResult.Errors;

            var offerDtos = offersResult.Value.Select(mapper.Map<OfferDto>);
            return offerDtos.ToList();
        }
    }
}
