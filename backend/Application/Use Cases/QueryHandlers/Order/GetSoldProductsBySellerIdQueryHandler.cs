using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetSoldProductsBySellerIdQueryHandler : IRequestHandler<GetSoldProductsBySellerIdQuery, ErrorOr<IEnumerable<OrderDto>>>
    {
        private readonly IOrderRepository repository;
        private readonly IMapper mapper;

        public GetSoldProductsBySellerIdQueryHandler(IOrderRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<ErrorOr<IEnumerable<OrderDto>>> Handle(GetSoldProductsBySellerIdQuery request, CancellationToken cancellationToken)
        {
            var result = await repository.GetSoldProductsBySellerIdAsync(request.UserId, cancellationToken);

            if (result.IsError)
            {
                return result.Errors;
            }

            var orders = result.Value;

            var orderDtos = mapper.Map<IEnumerable<OrderDto>>(orders);

            return orderDtos.ToList();
        }
    }
}
