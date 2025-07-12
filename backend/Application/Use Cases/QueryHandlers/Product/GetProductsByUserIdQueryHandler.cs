using Application.Use_Cases.Queries;
using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetProductsByUserIdQueryHandler : IRequestHandler<GetProductsByUserIdQuery, ErrorOr<IEnumerable<Product>>>
    {
        private readonly IProductRepository productRepository;
        public GetProductsByUserIdQueryHandler(IProductRepository productRepository)
        {
            this.productRepository = productRepository;
        }
        public async Task<ErrorOr<IEnumerable<Product>>> Handle(GetProductsByUserIdQuery request, CancellationToken cancellationToken)
        {
            return await productRepository.GetProductsByUserIdAsync(request.UserId, cancellationToken);
        }
    }
}
