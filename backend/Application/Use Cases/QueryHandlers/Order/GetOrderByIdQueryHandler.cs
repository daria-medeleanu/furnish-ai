using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, ErrorOr<OrderDto>>
    {
        private readonly IOrderRepository repository;
        private readonly IMapper mapper;

        public GetOrderByIdQueryHandler(IOrderRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<ErrorOr<OrderDto>> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
        {
            var result = await repository.GetByIdAsync(request.Id, cancellationToken);

            if (result.IsError)
            {
                return result.Errors;
            }

            var order = result.Value;

            var orderDto = mapper.Map<OrderDto>(order);

            return orderDto; 
        }
    }
}
