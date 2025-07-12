using Domain.Entities;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetProductsByUserIdQuery : IRequest<ErrorOr<IEnumerable<Product>>>
    {            
        public Guid UserId { get; set; }
    }
}
