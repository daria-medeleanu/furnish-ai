
using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetActiveProductsBySellerIdQuery : IRequest<ErrorOr<IEnumerable<OrderDto>>>
    {
        public Guid UserId { get; set; }
    }
}
