using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetAllProductsQuery : IRequest<ErrorOr<IEnumerable<ProductDto>>>
    {
        public Guid UserId { get; set; }
    }
}
