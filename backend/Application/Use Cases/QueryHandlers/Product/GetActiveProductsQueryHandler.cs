using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetActiveProductsQueryHandler : IRequestHandler<GetActiveProductsQuery, ErrorOr<IEnumerable<ProductDto>>>
    {
        private readonly IProductRepository productRepository;
        private readonly IMapper mapper;

        public GetActiveProductsQueryHandler(IProductRepository productRepository, IMapper mapper)
        {
            this.productRepository = productRepository;
            this.mapper = mapper;
        }

        public async Task<ErrorOr<IEnumerable<ProductDto>>> Handle(GetActiveProductsQuery request, CancellationToken cancellationToken)
        {
            var result = await productRepository.GetActiveProductsAsync(cancellationToken);
            if (result.IsError)
                return result.Errors;

            var productsDtos = mapper.Map<IEnumerable<ProductDto>>(result.Value);

            return productsDtos.ToList();
        }
    }
}
