using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetActiveProductsBySellerIdQueryHandler : IRequestHandler<GetActiveProductsBySellerIdQuery, ErrorOr<IEnumerable<OrderDto>>>
    {
        private readonly IOrderRepository orderRepository;
        private readonly IMapper mapper;
        public GetActiveProductsBySellerIdQueryHandler(IOrderRepository orderRepository, IMapper mapper)
        {
            this.orderRepository = orderRepository;
            this.mapper = mapper;
        }
        public async Task<ErrorOr<IEnumerable<OrderDto>>> Handle(GetActiveProductsBySellerIdQuery request, CancellationToken cancellationToken)
        {
            var productsResult = await orderRepository.GetActiveProductsBySellerIdAsync(request.UserId ,cancellationToken);
            if (productsResult.IsError)
                return productsResult.Errors;
            var productDtos = mapper.Map<IEnumerable<OrderDto>>(productsResult.Value);
            return productDtos.ToList();
        }
    }
}
