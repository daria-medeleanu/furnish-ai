using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetOrderByIdQuery : IRequest<ErrorOr<OrderDto>>
    {
        public Guid Id { get; set; }
    }
}
