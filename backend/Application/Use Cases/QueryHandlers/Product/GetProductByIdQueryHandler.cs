using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ErrorOr<ProductDto>>
    {
        private readonly IProductRepository repository;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public GetProductByIdQueryHandler(
            IProductRepository repository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            this.repository = repository;
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        public async Task<ErrorOr<ProductDto>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            var productResult = await repository.GetByIdAsync(request.Id, cancellationToken);
            if (productResult.IsError)
                return productResult.Errors;

            var product = productResult.Value;

            var userResult = await userRepository.GetByIdAsync(product.UserId, cancellationToken);
            if (userResult.IsError)
                return userResult.Errors;

            var productDto = mapper.Map<ProductDto>(product);
            productDto.User = mapper.Map<UserDto>(userResult.Value);

            return productDto;
        }
    }
}