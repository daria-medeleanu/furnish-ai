using Application.DTOs;
using Application.Use_Cases.Queries;
using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Querysandlers
{
    public class GetAllOrdersQueryHandler : IRequestHandler<GetAllOrdersQuery, ErrorOr<IEnumerable<OrderDto>>>
    {
        private readonly IOrderRepository repository;

        public GetAllOrdersQueryHandler(IOrderRepository repository)
        {
            this.repository = repository;
        }

        public async Task<ErrorOr<IEnumerable<OrderDto>>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
        {
            var result = await repository.GetAllAsync(cancellationToken);

            if (result.IsError)
            {
                return result.Errors;
            }

            var orders = result.Value;

            var orderDtos = orders.Select(order => new OrderDto
            {
                Id = order.Id,
                ClientId = order.ClientId,
                SellerId = order.SellerId,
                ProductId = order.ProductId,
                OrderDate = order.OrderDate,
                OrderStatus = order.OrderStatus,
                Address = order.Address,
                Price = order.Price,
                Currency = order.Currency
            });

            return orderDtos.ToList();
        }
    }
}
