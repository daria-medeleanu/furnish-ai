

using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetHistoryOrdersByUserIdQueryHandler : IRequestHandler<GetHistoryOrdersByUserIdQuery, ErrorOr<IEnumerable<OrderDto>>>
    {
        private readonly IOrderRepository orderRepository;
        private readonly IMapper mapper;
        public GetHistoryOrdersByUserIdQueryHandler(IOrderRepository orderRepository, IMapper mapper)
        {
            this.orderRepository = orderRepository;
            this.mapper = mapper;
        }
        public async Task<ErrorOr<IEnumerable<OrderDto>>> Handle(GetHistoryOrdersByUserIdQuery request, CancellationToken cancellationToken)
        {
            var ordersResult = await orderRepository.GetHistoryOrdersByUserIdAsync(request.UserId, cancellationToken);
            if (ordersResult.IsError)
                return ordersResult.Errors;
            var orderDtos = mapper.Map<IEnumerable<OrderDto>>(ordersResult.Value);
            return orderDtos.ToList();
        }
    }
}
