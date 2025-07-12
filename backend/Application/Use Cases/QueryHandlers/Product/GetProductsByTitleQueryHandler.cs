using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{ 
    public class GetProductsByTitleQueryHandler : IRequestHandler<GetProductsByTitleQuery, ErrorOr<IEnumerable<ProductDto>>>
    {
        private readonly IProductRepository productRepository;
        private readonly IMapper mapper;

        public GetProductsByTitleQueryHandler(IProductRepository productRepository, IMapper mapper)
        {
            this.productRepository = productRepository;
            this.mapper = mapper;
        }

        public async Task<ErrorOr<IEnumerable<ProductDto>>> Handle(GetProductsByTitleQuery request, CancellationToken cancellationToken)
        {
            var products = await productRepository.SearchByTitleAsync(request.Title, cancellationToken);
            if (products.IsError)
                return products.Errors;
            var productsDto = mapper.Map<IEnumerable<ProductDto>>(products.Value);
            return productsDto.ToList();
        }
    }
}
