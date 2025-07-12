using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, ErrorOr<IEnumerable<ProductDto>>>
    {
        private readonly IProductRepository repository;
        private readonly IFavoriteRepository favoriteRepository;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public GetAllProductsQueryHandler(IProductRepository repository, IUserRepository userRepository, IFavoriteRepository favoriteRepository, IMapper mapper)
        {
            this.repository = repository;
            this.userRepository = userRepository;
            this.favoriteRepository = favoriteRepository;
            this.mapper = mapper;
        }

        public async Task<ErrorOr<IEnumerable<ProductDto>>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
        {
            var productsResult = await repository.GetAllAsync(cancellationToken);
            if (productsResult.IsError)
                return productsResult.Errors;

            var products = productsResult.Value;
            var productDtos = new List<ProductDto>();

            foreach (var product in products)
            {
                var userResult = await userRepository.GetByIdAsync(product.UserId, cancellationToken);
                if (userResult.IsError)
                    continue; 

                var productDto = mapper.Map<ProductDto>(product);
                productDto.User = mapper.Map<UserDto>(userResult.Value);

                var isFavoriteResult = await favoriteRepository.IsFavoriteAsync(request.UserId, product.Id, cancellationToken);
                productDto.IsFavorite = isFavoriteResult.IsError ? false : isFavoriteResult.Value;

                productDtos.Add(productDto);
            }

            return productDtos;
        }
    }
}