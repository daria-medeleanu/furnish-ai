using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetActiveOrdersByUserIdQueryHandler : IRequestHandler<GetActiveOrdersByUserIdQuery, ErrorOr<IEnumerable<OrderDto>>>
    {
        private readonly IOrderRepository orderRepository;
        private readonly IMapper mapper;
        public GetActiveOrdersByUserIdQueryHandler(IOrderRepository orderRepository, IMapper mapper)
        {
            this.orderRepository = orderRepository;
            this.mapper = mapper;
        }
        public async Task<ErrorOr<IEnumerable<OrderDto>>> Handle(GetActiveOrdersByUserIdQuery request, CancellationToken cancellationToken)
        {
            var ordersResult = await orderRepository.GetActiveOrdersByUserIdAsync(request.UserId, cancellationToken);
            if (ordersResult.IsError)
                return ordersResult.Errors;
            if (ordersResult.Value == null)
                Console.WriteLine("e nul");

            var orderDtos = mapper.Map<IEnumerable<OrderDto>>(ordersResult.Value);

            return orderDtos.ToList();
        }

    }
}
